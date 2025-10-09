import React, { useState, useRef, useCallback } from 'react';

interface ControlButtonProps {
  isGameRunning: boolean;
  onMainButtonClick: () => void;
  onSettingsButtonClick: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  isGameRunning,
  onMainButtonClick,
  onSettingsButtonClick
}) => {
  const [showSettingsHint, setShowSettingsHint] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const buttonPressed = useRef(false);

  const handleSettingsTouchStart = useCallback(() => {
    buttonPressed.current = true;
    longPressTimer.current = window.setTimeout(() => {
      if (buttonPressed.current) {
        onSettingsButtonClick();
        setShowSettingsHint(false);
      }
    }, 2000);
    
    setShowSettingsHint(true);
  }, [onSettingsButtonClick]);

  const handleSettingsTouchEnd = useCallback(() => {
    buttonPressed.current = false;
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    window.setTimeout(() => setShowSettingsHint(false), 500);
  }, []);

  return (
    <>
      {/* Основная кнопка старта/стопа - в центре */}
      <div className="control-buttons-container">
        <button
          className={`main-control-button ${isGameRunning ? 'stop' : 'start'}`}
          onClick={onMainButtonClick}
        >
          {isGameRunning ? '⏹️' : '▶️'}
        </button>
      </div>

      {/* Кнопка настроек - отдельно у правого края */}
      <div className="settings-button-container">
        <button
          className="settings-button"
          onTouchStart={handleSettingsTouchStart}
          onTouchEnd={handleSettingsTouchEnd}
          onMouseDown={handleSettingsTouchStart}
          onMouseUp={handleSettingsTouchEnd}
          onMouseLeave={handleSettingsTouchEnd}
        >
          ⚙️
          {showSettingsHint && (
            <div className="settings-hint">
              Удерживайте 2 секунды
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default ControlButton;