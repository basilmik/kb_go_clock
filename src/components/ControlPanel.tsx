import React, { useState } from 'react';
import type { TimeControlMode } from '../types';


interface ControlPanelProps {
  mode: TimeControlMode;
  onModeChange: (mode: TimeControlMode) => void;
  onMainTimeSet: (player: 1 | 2, minutes: number, seconds: number) => void;
  onAdditionalTimeSet: (player: 1 | 2, seconds: number) => void;
  onByoyomiPeriodsSet: (player: 1 | 2, periods: number) => void;
  onCopySettings: (fromPlayer: 1 | 2, toPlayer: 1 | 2) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isGameStarted: boolean;
  activePlayer: 1 | 2 | null;
  onPlayerSelect: (player: 1 | 2) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  onModeChange,
  onMainTimeSet,
  onAdditionalTimeSet,
  onByoyomiPeriodsSet,
  onCopySettings,
  onStart,
  onPause,
  onReset,
  isGameStarted,
  activePlayer,
  onPlayerSelect
}) => {
  const [mainTime1, setMainTime1] = useState({ minutes: 5, seconds: 0 });
  const [mainTime2, setMainTime2] = useState({ minutes: 5, seconds: 0 });
  const [additionalTime1, setAdditionalTime1] = useState(5);
  const [additionalTime2, setAdditionalTime2] = useState(5);
  const [byoyomiPeriods1, setByoyomiPeriods1] = useState(5);
  const [byoyomiPeriods2, setByoyomiPeriods2] = useState(5);

  return (
    <div className="control-panel">
      {/* Выбор активного игрока */}
      <div className="control-section">
        <h3>Активный игрок</h3>
        <div className="player-selection">
          <button 
            onClick={() => onPlayerSelect(1)}
            disabled={isGameStarted}
            className={`player-button ${activePlayer === 1 ? 'active' : ''}`}
          >
            Игрок 1
          </button>
          <button 
            onClick={() => onPlayerSelect(2)}
            disabled={isGameStarted}
            className={`player-button ${activePlayer === 2 ? 'active' : ''}`}
          >
            Игрок 2
          </button>
        </div>
      </div>

      {/* Режим контроля времени */}
      <div className="control-section">
        <h3>Режим контроля времени</h3>
        <select 
          value={mode} 
          onChange={(e) => onModeChange(e.target.value as TimeControlMode)}
          disabled={isGameStarted}
          className="mode-select"
        >
          <option value="absolute">Абсолют</option>
          <option value="fischer">Фишер</option>
          <option value="byoyomi">Бё-ёми</option>
        </select>
      </div>

      <div className="players-settings">
        {/* Игрок 1 */}
        <div className="player-settings">
          <h3>Игрок 1</h3>
          
          <div className="time-input-group">
            <label>Основное время:</label>
            <div className="time-inputs">
              <input
                type="number"
                min="0"
                value={mainTime1.minutes}
                onChange={(e) => setMainTime1({...mainTime1, minutes: parseInt(e.target.value) || 0})}
                disabled={isGameStarted}
              />
              <span>мин</span>
              <input
                type="number"
                min="0"
                max="59"
                value={mainTime1.seconds}
                onChange={(e) => setMainTime1({...mainTime1, seconds: parseInt(e.target.value) || 0})}
                disabled={isGameStarted}
              />
              <span>сек</span>
              <button 
                onClick={() => onMainTimeSet(1, mainTime1.minutes, mainTime1.seconds)}
                disabled={isGameStarted}
                className="set-button"
              >
                ✓
              </button>
            </div>
          </div>

          {mode !== 'absolute' && (
            <div className="time-input-group">
              <label>Доп. время (сек):</label>
              <div className="additional-time">
                <input
                  type="number"
                  min="0"
                  value={additionalTime1}
                  onChange={(e) => setAdditionalTime1(parseInt(e.target.value) || 0)}
                  disabled={isGameStarted}
                />
                <button 
                  onClick={() => onAdditionalTimeSet(1, additionalTime1)}
                  disabled={isGameStarted}
                  className="set-button"
                >
                  ✓
                </button>
              </div>
            </div>
          )}

          {mode === 'byoyomi' && (
            <div className="time-input-group">
              <label>Периоды бё-ёми:</label>
              <div className="byoyomi-periods">
                <input
                  type="number"
                  min="0"
                  value={byoyomiPeriods1}
                  onChange={(e) => setByoyomiPeriods1(parseInt(e.target.value) || 0)}
                  disabled={isGameStarted}
                />
                <button 
                  onClick={() => onByoyomiPeriodsSet(1, byoyomiPeriods1)}
                  disabled={isGameStarted}
                  className="set-button"
                >
                  ✓
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Игрок 2 */}
        <div className="player-settings">
          <h3>Игрок 2</h3>
          
          <div className="time-input-group">
            <label>Основное время:</label>
            <div className="time-inputs">
              <input
                type="number"
                min="0"
                value={mainTime2.minutes}
                onChange={(e) => setMainTime2({...mainTime2, minutes: parseInt(e.target.value) || 0})}
                disabled={isGameStarted}
              />
              <span>мин</span>
              <input
                type="number"
                min="0"
                max="59"
                value={mainTime2.seconds}
                onChange={(e) => setMainTime2({...mainTime2, seconds: parseInt(e.target.value) || 0})}
                disabled={isGameStarted}
              />
              <span>сек</span>
              <button 
                onClick={() => onMainTimeSet(2, mainTime2.minutes, mainTime2.seconds)}
                disabled={isGameStarted}
                className="set-button"
              >
                ✓
              </button>
            </div>
          </div>

          {mode !== 'absolute' && (
            <div className="time-input-group">
              <label>Доп. время (сек):</label>
              <div className="additional-time">
                <input
                  type="number"
                  min="0"
                  value={additionalTime2}
                  onChange={(e) => setAdditionalTime2(parseInt(e.target.value) || 0)}
                  disabled={isGameStarted}
                />
                <button 
                  onClick={() => onAdditionalTimeSet(2, additionalTime2)}
                  disabled={isGameStarted}
                  className="set-button"
                >
                  ✓
                </button>
              </div>
            </div>
          )}

          {mode === 'byoyomi' && (
            <div className="time-input-group">
              <label>Периоды бё-ёми:</label>
              <div className="byoyomi-periods">
                <input
                  type="number"
                  min="0"
                  value={byoyomiPeriods2}
                  onChange={(e) => setByoyomiPeriods2(parseInt(e.target.value) || 0)}
                  disabled={isGameStarted}
                />
                <button 
                  onClick={() => onByoyomiPeriodsSet(2, byoyomiPeriods2)}
                  disabled={isGameStarted}
                  className="set-button"
                >
                  ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Кнопки копирования */}
      <div className="control-section">
        <h3>Копирование настроек</h3>
        <div className="copy-buttons">
          <button 
            onClick={() => onCopySettings(1, 2)} 
            disabled={isGameStarted}
            className="copy-button"
          >
            Копировать 1 → 2
          </button>
          <button 
            onClick={() => onCopySettings(2, 1)} 
            disabled={isGameStarted}
            className="copy-button"
          >
            Копировать 2 → 1
          </button>
        </div>
      </div>

      {/* Кнопка сброса */}
      <div className="control-section">
        <button 
          onClick={onReset}
          className="reset-button"
        >
          🔄 Сбросить часы
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;