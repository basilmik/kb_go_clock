import React, { useState, useRef, useCallback } from 'react';

interface ControlButtonProps {
  isGameStarted: boolean;
  onMainButtonClick: () => void;
  onSettingsButtonClick: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  isGameStarted,
  onMainButtonClick,
  onSettingsButtonClick
}) => {
  const [showSettingsHint, setShowSettingsHint] = useState(false);
  const longPressTimer = useRef<number | null>(null); // Исправлено: number вместо NodeJS.Timeout
  const buttonPressed = useRef(false);

  const handleSettingsTouchStart = useCallback(() => {
    buttonPressed.current = true;
    longPressTimer.current = window.setTimeout(() => { // Исправлено: window.setTimeout
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
      window.clearTimeout(longPressTimer.current); // Исправлено: window.clearTimeout
      longPressTimer.current = null;
    }
    window.setTimeout(() => setShowSettingsHint(false), 500); // Исправлено: window.setTimeout
  }, []);

  return (
    <div className="control-buttons-container">
      {/* Основная кнопка старта/стопа */}
      <button
        className={`main-control-button ${isGameStarted ? 'stop' : 'start'}`}
        onClick={onMainButtonClick}
      >
        {isGameStarted ? '⏹️' : '▶️'}
      </button>

      {/* Кнопка настроек (полукруг) */}
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
    </div>
  );
};

export default ControlButton;