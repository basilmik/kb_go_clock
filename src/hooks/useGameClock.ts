import { useState, useRef, useCallback, useEffect } from 'react';
import { GameClockState, TimeControlMode, PlayerTime } from '../types';

const useGameClock = () => {
  const [state, setState] = useState<GameClockState>({
    player1: {
      mainTime: 300,
      additionalTime: 5,
      byoyomiPeriods: 5,
      currentTime: 300,
      isRunning: false,
      usedPeriods: 0
    },
    player2: {
      mainTime: 300,
      additionalTime: 5,
      byoyomiPeriods: 5,
      currentTime: 300,
      isRunning: false,
      usedPeriods: 0
    },
    mode: 'absolute',
    activePlayer: null,
    isGameStarted: false
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundsRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Инициализация аудио
  const initAudio = useCallback(async () => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Здесь нужно загрузить аудиофайлы
      // await loadSound('30s', '/sounds/30s.wav');
      // await loadSound('10s', '/sounds/10s.wav');
      // await loadSound('5s', '/sounds/5s.wav');
      // await loadSound('switch', '/sounds/switch.wav');
    }
  }, []);

  const loadSound = useCallback(async (name: string, url: string) => {
    if (!audioContextRef.current) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      soundsRef.current.set(name, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sound ${name}:`, error);
    }
  }, []);

  const playSound = useCallback((name: string) => {
    if (!audioContextRef.current || !soundsRef.current.has(name)) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = soundsRef.current.get(name)!;
    source.connect(audioContextRef.current.destination);
    source.start();
  }, []);

  // Таймер
  const updateTimer = useCallback((player: 1 | 2) => {
    const now = Date.now();
    const elapsed = (now - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = now;

    setState(prevState => {
      const playerKey = `player${player}` as keyof GameClockState;
      const playerState = prevState[playerKey] as PlayerTime;
      
      const previousTime = Math.ceil(playerState.currentTime);
      const newTime = playerState.currentTime - elapsed;

      // Проверка звуковых уведомлений
      if (previousTime > 30 && Math.ceil(newTime) === 30) {
        playSound('30s');
      } else if (previousTime > 10 && Math.ceil(newTime) <= 10 && Math.ceil(newTime) > 0) {
        playSound('10s');
      } else if (previousTime > 5 && Math.ceil(newTime) <= 5 && Math.ceil(newTime) > 0) {
        playSound('5s');
      }

      // Проверка окончания времени
      if (newTime <= 0) {
        if (prevState.mode === 'byoyomi' && playerState.usedPeriods < playerState.byoyomiPeriods) {
          // Переход в бё-ёми
          return {
            ...prevState,
            [playerKey]: {
              ...playerState,
              currentTime: playerState.additionalTime,
              usedPeriods: playerState.usedPeriods + 1
            }
          };
        } else {
          // Время окончательно истекло
          clearTimer();
          return {
            ...prevState,
            isGameStarted: false,
            activePlayer: null,
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
  }, [playSound]);

  const startTimer = useCallback((player: 1 | 2) => {
    lastUpdateTimeRef.current = Date.now();
    timerRef.current = setInterval(() => updateTimer(player), 100);
    
    setState(prevState => ({
      ...prevState,
      [`player${player}`]: {
        ...prevState[`player${player}`],
        isRunning: true
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
    setState(prevState => {
      if (!prevState.activePlayer) return prevState;
      
      return {
        ...prevState,
        [`player${prevState.activePlayer}`]: {
          ...prevState[`player${prevState.activePlayer}`],
          isRunning: false
        }
      };
    });
  }, [clearTimer]);

  // Публичные методы
  const startGame = useCallback(() => {
    if (state.activePlayer) {
      setState(prev => ({ ...prev, isGameStarted: true }));
      startTimer(state.activePlayer);
    }
  }, [state.activePlayer, startTimer]);

  const pauseGame = useCallback(() => {
    stopTimer();
    setState(prev => ({ ...prev, isGameStarted: false }));
  }, [stopTimer]);

  const switchPlayer = useCallback(() => {
    if (!state.activePlayer) return;

    stopTimer();
    playSound('switch');

    const nextPlayer = state.activePlayer === 1 ? 2 : 1;
    
    setState(prev => ({ ...prev, activePlayer: nextPlayer }));
    
    if (state.isGameStarted) {
      startTimer(nextPlayer);
    }
  }, [state.activePlayer, state.isGameStarted, stopTimer, startTimer, playSound]);

  const setActivePlayer = useCallback((player: 1 | 2) => {
    if (state.activePlayer === player) return;
    
    stopTimer();
    setState(prev => ({ ...prev, activePlayer: player }));
    
    if (state.isGameStarted) {
      startTimer(player);
    }
  }, [state.activePlayer, state.isGameStarted, stopTimer, startTimer]);

  const setMainTime = useCallback((player: 1 | 2, minutes: number, seconds: number = 0) => {
    const totalSeconds = minutes * 60 + seconds;
    setState(prev => ({
      ...prev,
      [`player${player}`]: {
        ...prev[`player${player}`],
        mainTime: totalSeconds,
        currentTime: prev.isGameStarted ? prev[`player${player}`].currentTime : totalSeconds
      }
    }));
  }, []);

  const setAdditionalTime = useCallback((player: 1 | 2, seconds: number) => {
    setState(prev => ({
      ...prev,
      [`player${player}`]: {
        ...prev[`player${player}`],
        additionalTime: seconds
      }
    }));
  }, []);

  const setByoyomiPeriods = useCallback((player: 1 | 2, periods: number) => {
    setState(prev => ({
      ...prev,
      [`player${player}`]: {
        ...prev[`player${player}`],
        byoyomiPeriods: periods
      }
    }));
  }, []);

  const setMode = useCallback((mode: TimeControlMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const copySettings = useCallback((fromPlayer: 1 | 2, toPlayer: 1 | 2) => {
    setState(prev => {
      const fromState = prev[`player${fromPlayer}`];
      const toState = prev[`player${toPlayer}`];
      
      return {
        ...prev,
        [`player${toPlayer}`]: {
          ...toState,
          mainTime: fromState.mainTime,
          additionalTime: fromState.additionalTime,
          byoyomiPeriods: fromState.byoyomiPeriods,
          currentTime: prev.isGameStarted ? toState.currentTime : fromState.mainTime
        }
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    clearTimer();
    setState({
      player1: {
        mainTime: 300,
        additionalTime: 5,
        byoyomiPeriods: 5,
        currentTime: 300,
        isRunning: false,
        usedPeriods: 0
      },
      player2: {
        mainTime: 300,
        additionalTime: 5,
        byoyomiPeriods: 5,
        currentTime: 300,
        isRunning: false,
        usedPeriods: 0
      },
      mode: 'absolute',
      activePlayer: null,
      isGameStarted: false
    });
  }, [clearTimer]);

  // Эффекты
  useEffect(() => {
    initAudio();
    
    return () => {
      clearTimer();
    };
  }, [initAudio, clearTimer]);

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