import React from 'react';
import type { PlayerTime, TimeControlMode } from '../types';

interface TimeDisplayProps {
  time: number;
  isRunning: boolean;
  isActive: boolean;
  playerNumber: 1 | 2;
  onPress: () => void;
  isGameRunning: boolean;
  mode: TimeControlMode;
  playerTime: PlayerTime;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  time,
  isRunning,
  isActive,
  playerNumber,
  onPress,
  mode,
  playerTime
}) => {
  const formatTime = (seconds: number): string => {
    const absSeconds = Math.max(0, Math.abs(seconds));
    const minutes = Math.floor(absSeconds / 60);
    const remainingSeconds = Math.ceil(absSeconds % 60);
    const sign = seconds < 0 ? '-' : '';
    
    return `${sign}${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getBackgroundColor = () => {
    // if (isRunning && isActive) return '#06205b ';
    // if (isActive) return '#e8f5e8';
    return '#f5f5f5';
  };

  const getTextColor = () => {
    // if (time <= 10 && time > 0) return '#f44336';
    // if (time <= 0) return '#d32f2f';
    return '#06205b';
  };

  // Отображение информации о основном времени (всегда)
  const renderMainTimeInfo = () => {
    const mainMinutes = Math.floor(playerTime.mainTime / 60);
    const mainSeconds = playerTime.mainTime % 60;
    const currentPeriod = playerTime.currentPeriod;

    return (
      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>
        {currentPeriod}
      </div>
    );
  };

  // Отображение дополнительной информации в зависимости от режима
  const renderAdditionalInfo = () => {
      switch (mode) {
        case 'fischer':
          return (
            <div style={{ fontSize: '4rem', color: '#06205b', marginTop: '5px' }}>
              +{playerTime.additionalTime}
            </div>
          );
        case 'byoyomi':
          return (
            <div style={{ fontSize: '4rem', color: '#06205b', marginLeft: '50px' }}>
              {playerTime.currentPeriod === -1 ? playerTime.byoyomiPeriods : playerTime.currentPeriod} × {playerTime.additionalTime}
            </div>
          );
        default:
          return null;
      }
  };

  return (
    <div
      className={`time-display player${playerNumber}`}
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
      <div 
        className="time-content"
      >
        {/* {renderMainTimeInfo()} */}
        
        <div style={{
          fontSize: 'clamp(10rem, 10vw, 4rem)',
          fontWeight: 'bold',
          color: getTextColor(),
          textAlign: 'center',
          margin: '10px'
        }}>
          {formatTime(time)}
        </div>
        
        {renderAdditionalInfo()}
      </div>
    </div>
  );
};

export default TimeDisplay;