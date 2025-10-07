import React, { useState } from 'react';
import useGameClock from './hooks/useGameClock';
import TimeDisplay from './components/TimeDisplay';
import ControlPanel from './components/ControlPanel';
import ControlButton from './components/ControlButton';
import './App.css';

const App: React.FC = () => {
  const {
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
  } = useGameClock();

  const [showSettings, setShowSettings] = useState(false);

  const handlePlayerPress = (player: 1 | 2) => {
    // Разрешаем переключать игроков в любом состоянии (даже когда игра не начата)
    // Только если есть активный игрок и нажали не на текущего активного
    if (state.activePlayer && state.activePlayer !== player) {
      switchPlayer();
    } else if (!state.activePlayer) {
      // Если нет активного игрока, устанавливаем нажатого
      setActivePlayer(player);
    }
  };

  const handleMainButtonClick = () => {
    if (state.isGameStarted) {
      pauseGame();
    } else {
      // Перед стартом проверяем, что есть активный игрок
      if (state.activePlayer) {
        startGame();
      } else {
        // Если нет активного игрока, устанавливаем первого и начинаем
        setActivePlayer(1);
        startGame();
      }
    }
  };

  return (
    <div className="app">
      <div className="time-displays">
        <TimeDisplay
          time={state.player1.currentTime}
          isRunning={state.player1.isRunning}
          isActive={state.activePlayer === 1}
          playerNumber={1}
          onPress={() => handlePlayerPress(1)}
          isGameStarted={state.isGameStarted}
          mode={state.mode}
          playerTime={state.player1}
        />
        
        {/* Центральная кнопка управления */}
        <ControlButton
          isGameStarted={state.isGameStarted}
          onMainButtonClick={handleMainButtonClick}
          onSettingsButtonClick={() => setShowSettings(true)}
        />
        
        <TimeDisplay
          time={state.player2.currentTime}
          isRunning={state.player2.isRunning}
          isActive={state.activePlayer === 2}
          playerNumber={2}
          onPress={() => handlePlayerPress(2)}
          isGameStarted={state.isGameStarted}
          mode={state.mode}
          playerTime={state.player2}
        />
      </div>

      {/* Модальное окно настроек */}
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-modal">
            <div className="settings-header">
              <h2>Настройки часов</h2>
              <button 
                className="close-button"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>
            
            <ControlPanel
              mode={state.mode}
              onModeChange={setMode}
              onMainTimeSet={setMainTime}
              onAdditionalTimeSet={setAdditionalTime}
              onByoyomiPeriodsSet={setByoyomiPeriods}
              onCopySettings={copySettings}
              onStart={startGame}
              onPause={pauseGame}
              onReset={resetGame}
              isGameStarted={state.isGameStarted}
              activePlayer={state.activePlayer}
              onPlayerSelect={setActivePlayer}
              player1={state.player1}
              player2={state.player2}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;