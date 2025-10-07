import React from 'react';

interface TimeDisplayProps {
  time: number;
  isRunning: boolean;
  isActive: boolean;
  playerNumber: 1 | 2;
  onPress: () => void;
  isGameStarted: boolean;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  time,
  isRunning,
  isActive,
  playerNumber,
  onPress,
  isGameStarted
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
        cursor: isGameStarted ? 'pointer' : 'default',
        userSelect: 'none',
        borderBottom: playerNumber === 1 ? '2px solid #ddd' : 'none',
        borderTop: playerNumber === 2 ? '2px solid #ddd' : 'none',
        position: 'relative',
        zIndex: 1
      }}
      onClick={onPress}
    >
      <div style={{
        fontSize: 'clamp(2rem, 10vw, 4rem)',
        fontWeight: 'bold',
        color: getTextColor(),
        textAlign: 'center',
        margin: '10px'
      }}>
        {formatTime(time)}
      </div>
      <div style={{
        fontSize: '1rem',
        color: '#666',
        marginTop: '10px'
      }}>
        {isRunning ? '▶' : '⏸'} Игрок {playerNumber}
        {isActive && !isRunning && isGameStarted && ' (активный)'}
      </div>
    </div>
  );
};

export default TimeDisplay;