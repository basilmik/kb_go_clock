import React from 'react';
import type { PlayerTime, TimeControlMode } from '../types';

interface TimeDisplayProps {
  time: number;
  isRunning: boolean;
  isActive: boolean;
  playerNumber: 1 | 2;
  onPress: () => void;
  isGameStarted: boolean;
  mode: TimeControlMode;
  playerTime: PlayerTime;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  time,
  isRunning,
  isActive,
  playerNumber,
  onPress,
  isGameStarted,
  mode,
  playerTime
}) => {
  const formatTime = (seconds: number): string => {
    const absSeconds = Math.max(0, Math.abs(seconds));
    const minutes = Math.floor(absSeconds / 60);
    const remainingSeconds = Math.floor(absSeconds % 60);
    const sign = seconds < 0 ? '-' : '';
    
    return `${sign}${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getBackgroundColor = () => {
    if (isRunning && isActive) return '#e8f5e8';
    if (isActive) return '#c8e6c9';
    return '#f5f5f5';
  };

  const getTextColor = () => {
    if (time <= 10 && time > 0) return '#f44336';
    if (time <= 0) return '#d32f2f';
    return '#333';
  };

  // Отображение информации о основном времени (всегда)
  const renderMainTimeInfo = () => {
    const mainMinutes = Math.floor(playerTime.mainTime / 60);
    const mainSeconds = playerTime.mainTime % 60;
    return (
      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>
        Основное: {mainMinutes}:{mainSeconds.toString().padStart(2, '0')}
      </div>
    );
  };

  // Отображение дополнительной информации в зависимости от режима
  const renderAdditionalInfo = () => {
    if (!isGameStarted) {
      // Перед началом игры показываем настройки
      switch (mode) {
        case 'fischer':
          return (
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              +{playerTime.additionalTime} сек
            </div>
          );
        case 'byoyomi':
          return (
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              {playerTime.byoyomiPeriods} период(ов) × {playerTime.additionalTime} сек
            </div>
          );
        default:
          return null;
      }
    } else {
      // Во время игры показываем текущее состояние
      switch (mode) {
        case 'byoyomi':
          let displayPeriods;
          if (playerTime.usedPeriods === 0) {
            // Основное время - показываем все периоды
            displayPeriods = playerTime.byoyomiPeriods;
          } else {
            // В периодах бё-ёми - показываем оставшиеся периоды + 1
            // usedPeriods = 1 (3-й период) → displayPeriods = 3
            // usedPeriods = 2 (2-й период) → displayPeriods = 2  
            // usedPeriods = 3 (1-й период) → displayPeriods = 1
            displayPeriods = playerTime.byoyomiPeriods - playerTime.usedPeriods + 1;
          }
          return (
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              Периодов: {displayPeriods}
            </div>
          );
        case 'fischer':
          if (isActive) {
            return (
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                +{playerTime.additionalTime} сек после хода
              </div>
            );
          }
          return null;
        default:
          return null;
      }
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: getBackgroundColor(),
        transform: playerNumber === 1 ? 'rotate(180deg)' : 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        userSelect: 'none',
        borderBottom: playerNumber === 1 ? '2px solid #ddd' : 'none',
        borderTop: playerNumber === 2 ? '2px solid #ddd' : 'none',
        position: 'relative',
        zIndex: 1,
        padding: '10px',
        boxSizing: 'border-box'
      }}
      onClick={onPress}
    >
      {renderMainTimeInfo()}
      
      <div style={{
        fontSize: 'clamp(2rem, 10vw, 4rem)',
        fontWeight: 'bold',
        color: getTextColor(),
        textAlign: 'center',
        margin: '10px'
      }}>
        {formatTime(time)}
      </div>
      
      {renderAdditionalInfo()}
    </div>
  );
};

export default TimeDisplay;