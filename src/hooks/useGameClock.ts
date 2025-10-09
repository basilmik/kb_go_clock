import { useState, useRef, useCallback, useEffect } from 'react';
import type { GameClockState, TimeControlMode, PlayerTime } from '../types';

const useGameClock = () => {
  const [state, setState] = useState<GameClockState>({
    player1: {
      mainTime: 2,
      additionalTime: 5,
      byoyomiPeriods: 3,
      currentTime: 2,
      isRunning: false,
      currentPeriod: -1
    },
    player2: {
      mainTime: 2,
      additionalTime: 5,
      byoyomiPeriods: 3,
      currentTime: 2,
      isRunning: false,
      currentPeriod: -1
    },
    mode: 'byoyomi',
    activePlayer: 1,
    isGameRunning: false,
    isFlagFallen: false
  });

  const timerRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // Таймер
  const updateTimer = useCallback((player: 1 | 2) => {
    var now = Date.now();
    var elapsed = ((now - lastUpdateTimeRef.current) / 1000);

    lastUpdateTimeRef.current = now;

    setState(prevState => {
      const playerKey = `player${player}` as keyof GameClockState;
      const playerState = prevState[playerKey] as PlayerTime;
      
      const newTime = playerState.currentTime - elapsed;

      // Проверка окончания времени
      if (newTime <= 0) {
        if (prevState.mode === 'byoyomi' && playerState.currentPeriod === -1) {
          // Первый переход в бё-ёми - основное время полностью закончилось
          // Начинаем последний период (3-й при 3 периодах)


          return {
            ...prevState,
            [playerKey]: {
              ...playerState,
              currentTime: playerState.additionalTime ,
              currentPeriod: playerState.byoyomiPeriods // Начинаем использовать периоды
            }
          };
        } else if (prevState.mode === 'byoyomi' && playerState.currentPeriod != -1) {
          // Тратится период в бё-ёми
          const newcurrentPeriod = playerState.currentPeriod - 1;
          
          // Если после траты периода остались еще периоды
          if (newcurrentPeriod > 0) {
            
            return {
              ...prevState,
              [playerKey]: {
                ...playerState,
                currentTime: playerState.additionalTime, // Начинаем следующий период
                currentPeriod: newcurrentPeriod
              }
            };
          } else {
            // Все периоды израсходованы - время вышло
            clearTimer();
            return {
              ...prevState,
              isGameRunning: false,
              isFlagFallen: true,

              [playerKey]: {
                ...playerState,
                isRunning: false,
                currentTime: 0,
                currentPeriod: newcurrentPeriod
              }
            };
          }
        } else {
          // Время окончательно истекло (в абсолютном режиме)
          clearTimer();
          return {
            ...prevState,
            isGameRunning: false,
            isFlagFallen: true,

            [playerKey]: {
              ...playerState,
              isRunning: false,
              currentTime: 0
            }
          };
        }
      }

      return {
        ...prevState,
        [playerKey]: {
          ...playerState,
          currentTime: newTime
        }
      };
    });


  }, [state.isGameRunning, state.isFlagFallen]);

  const startTimer = useCallback((player: 1 | 2) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    lastUpdateTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => updateTimer(player), 100);
    
    setState(prevState => ({
      ...prevState,
      [`player${player}`]: {
        ...prevState[`player${player}`],
        isRunning: true
      },
      [`player${player === 1 ? 2 : 1}`]: {
        ...prevState[`player${player === 1 ? 2 : 1}`],
        isRunning: false
      }
    }));
  }, [updateTimer]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopTimer = useCallback(() => {
    clearTimer();
    setState(prevState => ({
      ...prevState,
      player1: {
        ...prevState.player1,
        isRunning: false
      },
      player2: {
        ...prevState.player2,
        isRunning: false
      }
    }));
  }, [clearTimer]);

  // Публичные методы
  const startGame = useCallback(() => {
    
    if (!state.isFlagFallen) {
      setState(prev => ({ ...prev, isGameRunning: true }));
      startTimer(state.activePlayer);
    }
  }, [state.activePlayer, startTimer]);

  const pauseGame = useCallback(() => {
    stopTimer();
    if (!state.isFlagFallen) {
    setState(prev => ({ ...prev, isGameRunning: false }));
    }
  }, [stopTimer]);

  const switchPlayer = useCallback(() => {

    // Останавливаем таймер текущего игрока
    stopTimer();

    // Логика для разных режимов
    if (state.isGameRunning) {
      setState(prevState => {
        const currentPlayerKey = `player${state.activePlayer}` as keyof GameClockState;
        const currentPlayerState = prevState[currentPlayerKey] as PlayerTime;
        const nextPlayer = state.activePlayer === 1 ? 2 : 1;
        
        let updatedState = { ...prevState };

        if (prevState.mode === 'fischer') {
          // Режим Фишера - добавляем время текущему игроку
          updatedState = {
            ...updatedState,
            [currentPlayerKey]: {
              ...currentPlayerState,
              currentTime: currentPlayerState.currentTime + currentPlayerState.additionalTime
            }
          };
        } else if (prevState.mode === 'byoyomi' && currentPlayerState.currentPeriod != -1) {
          // Режим бё-ёми - сбрасываем время на полную длительность периода
          // ТОЛЬКО если игрок уже в бё-ёми (currentPeriod != 1 )
          updatedState = {
            ...updatedState,
            [currentPlayerKey]: {
              ...currentPlayerState,
              currentTime: currentPlayerState.additionalTime
            }
          };
        }
        
        // Переключаем активного игрока
        updatedState.activePlayer = nextPlayer;
        
        return updatedState;
      });
      
      // Запускаем таймер следующего игрока
      const nextPlayer = state.activePlayer === 1 ? 2 : 1;
      startTimer(nextPlayer);
    } else {
      // Если игра не запущена, просто переключаем активного игрока
      const nextPlayer = state.activePlayer === 1 ? 2 : 1;
      setState(prev => ({ 
        ...prev, 
        activePlayer: nextPlayer 
      }));
    }
  }, [state.activePlayer, state.isGameRunning,  state.mode, stopTimer, startTimer]);

  const setActivePlayer = useCallback((player: 1 | 2) => {
    if (state.activePlayer === player) return;
    
    stopTimer();
    setState(prev => ({ 
      ...prev, 
      activePlayer: player 
    }));
  }, [state.activePlayer, stopTimer]);

  const setMainTime = useCallback((player: 1 | 2, minutes: number, seconds: number = 0) => {
    const totalSeconds = minutes * 60 + seconds;
    setState(prev => ({
      ...prev,
      [`player${player}`]: {
        ...prev[`player${player}`],
        mainTime: totalSeconds,
        currentTime: prev.isGameRunning ? prev[`player${player}`].currentTime : totalSeconds
        // , currentPeriod: 0
      }
    }));
  }, []);

  const setAdditionalTime = useCallback((player: 1 | 2, seconds: number) => {
    setState(prev => ({
      ...prev,
      [`player${player}`]: {
        ...prev[`player${player}`],
        additionalTime: seconds
        
        // , currentPeriod: 0
      }
    }));
  }, []);

  const setByoyomiPeriods = useCallback((player: 1 | 2, periods: number) => {
    setState(prev => ({
      ...prev,
      [`player${player}`]: {
        ...prev[`player${player}`],
        byoyomiPeriods: periods,
        currentPeriod: 0
      }
    }));
  }, []);

  const setMode = useCallback((mode: TimeControlMode) => {
    setState(prev => ({ 
      ...prev, 
      mode,
      player1: {
        ...prev.player1,
        currentTime: prev.player1.mainTime,
        currentPeriod: 0
      },
      player2: {
        ...prev.player2,
        currentTime: prev.player2.mainTime,
        currentPeriod: 0
      }
    }));
  }, []);

  const copySettings = useCallback((fromPlayer: 1 | 2, toPlayer: 1 | 2) => {
    setState(prev => {
      const fromState = prev[`player${fromPlayer}`];
      
      return {
        ...prev,
        [`player${toPlayer}`]: {
          ...prev[`player${toPlayer}`],
          mainTime: fromState.mainTime,
          additionalTime: fromState.additionalTime,
          byoyomiPeriods: fromState.byoyomiPeriods,
          currentTime: prev.isGameRunning ? prev[`player${toPlayer}`].currentTime : fromState.mainTime,
          currentPeriod: 0
        }
      };
    });
  }, []);


  const resetGame = useCallback(() => {
    clearTimer();
    setState(prev => ({
      ...prev,
      player1: {
        ...prev.player1,
        currentTime: prev.player1.mainTime, // Используем основное время из настроек
        isRunning: false,
        currentPeriod: -1
      },
      player2: {
        ...prev.player2,
        currentTime: prev.player2.mainTime, // Используем основное время из настроек
        isRunning: false,
        currentPeriod: -1
      },
      isGameRunning: false,
      isFlagFallen: false,
      activePlayer: prev.activePlayer,
    }));
  }, [clearTimer 

// , state.activePlayer, state.isFlagFallen

  ]);

  // Эффекты
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    state,
    startGame,
    pauseGame,
    switchPlayer,
    setActivePlayer,
    setMainTime,
    setAdditionalTime,
    setByoyomiPeriods,
    setMode,
    copySettings,
    resetGame
  };
};

export default useGameClock;