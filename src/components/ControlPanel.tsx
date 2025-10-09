import React, { useState, useEffect } from 'react';
import type { TimeControlMode, PlayerTime } from '../types';

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
  isGameRunning: boolean;
  activePlayer: 1 | 2 | null;
  onPlayerSelect: (player: 1 | 2) => void;
  player1: PlayerTime;
  player2: PlayerTime;
}

// Типы для состояний с поддержкой пустых значений
type TimeField = number | '';
interface MainTimeState {
  minutes: TimeField;
  seconds: TimeField;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  onModeChange,
  onMainTimeSet,
  onAdditionalTimeSet,
  onByoyomiPeriodsSet,
  onCopySettings,
  onReset,
  isGameRunning,

  player1,
  player2
}) => {
  // Инициализация состояний из пропсов
  const [mainTime1, setMainTime1] = useState<MainTimeState>({ 
    minutes: Math.floor(player1.mainTime / 60), 
    seconds: player1.mainTime % 60 
  });
  const [mainTime2, setMainTime2] = useState<MainTimeState>({ 
    minutes: Math.floor(player2.mainTime / 60), 
    seconds: player2.mainTime % 60 
  });
  const [additionalTime1, setAdditionalTime1] = useState<TimeField>(player1.additionalTime);
  const [additionalTime2, setAdditionalTime2] = useState<TimeField>(player2.additionalTime);
  const [byoyomiPeriods1, setByoyomiPeriods1] = useState<TimeField>(player1.byoyomiPeriods);
  const [byoyomiPeriods2, setByoyomiPeriods2] = useState<TimeField>(player2.byoyomiPeriods);

  // Синхронизация с основным состоянием при изменении пропсов
  useEffect(() => {
    setMainTime1({ 
      minutes: Math.floor(player1.mainTime / 60), 
      seconds: player1.mainTime % 60 
    });
    setAdditionalTime1(player1.additionalTime);
    setByoyomiPeriods1(player1.byoyomiPeriods);
  }, [player1]);

  useEffect(() => {
    setMainTime2({ 
      minutes: Math.floor(player2.mainTime / 60), 
      seconds: player2.mainTime % 60 
    });
    setAdditionalTime2(player2.additionalTime);
    setByoyomiPeriods2(player2.byoyomiPeriods);
  }, [player2]);

  // Вспомогательная функция для получения числового значения (0 если пусто)
  const getNumberValue = (value: TimeField): number => {
    return value === '' ? 0 : value;
  };

  // Обработчики изменений с поддержкой пустых значений
  const handleMainTimeChange1 = (field: 'minutes' | 'seconds', value: string) => {
    // Если значение пустое, устанавливаем пустую строку
    if (value === '') {
      const newMainTime = { ...mainTime1, [field]: '' as const };
      setMainTime1(newMainTime);
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const newMainTime = { ...mainTime1, [field]: numValue };
      setMainTime1(newMainTime);
      onMainTimeSet(1, 
        getNumberValue(newMainTime.minutes), 
        getNumberValue(newMainTime.seconds)
      );
    }
  };

  const handleMainTimeChange2 = (field: 'minutes' | 'seconds', value: string) => {
    if (value === '') {
      const newMainTime = { ...mainTime2, [field]: '' as const };
      setMainTime2(newMainTime);
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const newMainTime = { ...mainTime2, [field]: numValue };
      setMainTime2(newMainTime);
      onMainTimeSet(2, 
        getNumberValue(newMainTime.minutes), 
        getNumberValue(newMainTime.seconds)
      );
    }
  };

  const handleAdditionalTimeChange1 = (value: string) => {
    if (value === '') {
      setAdditionalTime1('');
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setAdditionalTime1(numValue);
      onAdditionalTimeSet(1, numValue);
    }
  };

  const handleAdditionalTimeChange2 = (value: string) => {
    if (value === '') {
      setAdditionalTime2('');
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setAdditionalTime2(numValue);
      onAdditionalTimeSet(2, numValue);
    }
  };

  const handleByoyomiPeriodsChange1 = (value: string) => {
    if (value === '') {
      setByoyomiPeriods1('');
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setByoyomiPeriods1(numValue);
      onByoyomiPeriodsSet(1, numValue);
    }
  };

  const handleByoyomiPeriodsChange2 = (value: string) => {
    if (value === '') {
      setByoyomiPeriods2('');
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setByoyomiPeriods2(numValue);
      onByoyomiPeriodsSet(2, numValue);
    }
  };

  // Обработчики для onBlur - устанавливают 0 если поле пустое
  const handleBlur1 = (field: 'minutes' | 'seconds') => {
    if (mainTime1[field] === '') {
      const newMainTime = { 
        minutes: field === 'minutes' ? 0 : getNumberValue(mainTime1.minutes),
        seconds: field === 'seconds' ? 0 : getNumberValue(mainTime1.seconds)
      };
      setMainTime1(newMainTime);
      onMainTimeSet(1, newMainTime.minutes, newMainTime.seconds);
    }
  };

  const handleBlur2 = (field: 'minutes' | 'seconds') => {
    if (mainTime2[field] === '') {
      const newMainTime = { 
        minutes: field === 'minutes' ? 0 : getNumberValue(mainTime2.minutes),
        seconds: field === 'seconds' ? 0 : getNumberValue(mainTime2.seconds)
      };
      setMainTime2(newMainTime);
      onMainTimeSet(2, newMainTime.minutes, newMainTime.seconds);
    }
  };

  const handleAdditionalBlur1 = () => {
    if (additionalTime1 === '') {
      const newValue = 0;
      setAdditionalTime1(newValue);
      onAdditionalTimeSet(1, newValue);
    }
  };

  const handleAdditionalBlur2 = () => {
    if (additionalTime2 === '') {
      const newValue = 0;
      setAdditionalTime2(newValue);
      onAdditionalTimeSet(2, newValue);
    }
  };

  const handleByoyomiBlur1 = () => {
    if (byoyomiPeriods1 === '') {
      const newValue = 0;
      setByoyomiPeriods1(newValue);
      onByoyomiPeriodsSet(1, newValue);
    }
  };

  const handleByoyomiBlur2 = () => {
    if (byoyomiPeriods2 === '') {
      const newValue = 0;
      setByoyomiPeriods2(newValue);
      onByoyomiPeriodsSet(2, newValue);
    }
  };

  const handleCopySettings = (fromPlayer: 1 | 2, toPlayer: 1 | 2) => {
    onCopySettings(fromPlayer, toPlayer);
  };

  return (
    <div className="control-panel">
      {/* Верхняя строка: выбор режима и кнопка сброса */}
      <div className="top-controls">
        <select 
          value={mode} 
          onChange={(e) => onModeChange(e.target.value as TimeControlMode)}
          disabled={isGameRunning}
          className="mode-select"
        >
          <option value="absolute">Абсолют</option>
          <option value="fischer">Фишер</option>
          <option value="byoyomi">Бё-ёми</option>
        </select>
        
        <button 
          onClick={onReset}
          className="reset-button"
        >
          🔄 Сбросить
        </button>
      </div>

      {/* Настройки игроков с кнопкой копирования между ними */}
      <div className="players-settings-container">
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
                onChange={(e) => handleMainTimeChange1('minutes', e.target.value)}
                onBlur={() => handleBlur1('minutes')}
                disabled={isGameRunning}
                placeholder="0"
              />
              <span>мин</span>
              <input
                type="number"
                min="0"
                max="59"
                value={mainTime1.seconds}
                onChange={(e) => handleMainTimeChange1('seconds', e.target.value)}
                onBlur={() => handleBlur1('seconds')}
                disabled={isGameRunning}
                placeholder="0"
              />
              <span>сек</span>
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
                  onChange={(e) => handleAdditionalTimeChange1(e.target.value)}
                  onBlur={handleAdditionalBlur1}
                  disabled={isGameRunning}
                  placeholder="0"
                />
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
                  onChange={(e) => handleByoyomiPeriodsChange1(e.target.value)}
                  onBlur={handleByoyomiBlur1}
                  disabled={isGameRunning}
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Кнопка копирования 1 → 2 */}
        <button 
          onClick={() => handleCopySettings(1, 2)} 
          disabled={isGameRunning}
          className="copy-button-small"
        >
          1 → 2
        </button>

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
                onChange={(e) => handleMainTimeChange2('minutes', e.target.value)}
                onBlur={() => handleBlur2('minutes')}
                disabled={isGameRunning}
                placeholder="0"
              />
              <span>мин</span>
              <input
                type="number"
                min="0"
                max="59"
                value={mainTime2.seconds}
                onChange={(e) => handleMainTimeChange2('seconds', e.target.value)}
                onBlur={() => handleBlur2('seconds')}
                disabled={isGameRunning}
                placeholder="0"
              />
              <span>сек</span>
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
                  onChange={(e) => handleAdditionalTimeChange2(e.target.value)}
                  onBlur={handleAdditionalBlur2}
                  disabled={isGameRunning}
                  placeholder="0"
                />
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
                  onChange={(e) => handleByoyomiPeriodsChange2(e.target.value)}
                  onBlur={handleByoyomiBlur2}
                  disabled={isGameRunning}
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;