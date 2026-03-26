import React, { useState, useEffect, useRef } from 'react';

const TimerInstance: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [inputMin, setInputMin] = useState('0');
  const [inputSec, setInputSec] = useState('0');
  const timerRef = useRef<any>(null);
  const longPressRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleStart = () => {
    if (!isRunning && timeLeft === 0) {
      const total = parseInt(inputMin || '0') * 60 + parseInt(inputSec || '0');
      if (total > 0) {
        setTimeLeft(total);
        setIsRunning(true);
      }
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setInputMin('0');
    setInputSec('0');
  };

  const startLongPress = () => {
    longPressRef.current = setTimeout(() => {
      handleReset();
      // Vibrate if supported
      if ('vibrate' in navigator) navigator.vibrate(50);
    }, 800);
  };

  const cancelLongPress = () => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const minInputRef = useRef<HTMLInputElement>(null);
  const secInputRef = useRef<HTMLInputElement>(null);

  const handleMinKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      secInputRef.current?.focus();
    }
  };

  return (
    <div className="timer-instance glass" style={{ 
      flex: 1, 
      padding: '0.75rem', 
      borderRadius: '12px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '0.5rem',
      minWidth: '140px'
    }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: timeLeft > 0 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
        {formatTime(timeLeft || (parseInt(inputMin || '0') * 60 + parseInt(inputSec || '0')))}
      </div>
      
      {!isRunning && timeLeft === 0 ? (
        <>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <input 
              ref={minInputRef}
              type="number" 
              value={inputMin} 
              onChange={(e) => setInputMin(e.target.value)} 
              onKeyDown={handleMinKeyDown}
              style={{ width: '45px', padding: '0.25rem', textAlign: 'center', fontSize: '0.8rem' }}
              placeholder="分"
            />
            <span style={{ fontSize: '0.8rem' }}>:</span>
            <input 
              ref={secInputRef}
              type="number" 
              value={inputSec} 
              onChange={(e) => setInputSec(e.target.value)} 
              style={{ width: '45px', padding: '0.25rem', textAlign: 'center', fontSize: '0.8rem' }}
              placeholder="秒"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
            <button 
              onClick={() => setInputMin(prev => (parseInt(prev || '0') + 1).toString())}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', background: 'rgba(250, 204, 21, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', borderRadius: '4px' }}
            >
              +1分
            </button>
            <button 
              onClick={() => setInputMin(prev => (parseInt(prev || '0') + 10).toString())}
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', background: 'rgba(250, 204, 21, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', borderRadius: '4px' }}
            >
              +10分
            </button>
          </div>
        </>
      ) : (
        <div style={{ height: '48px' }} /> // Spacer adjusted for added buttons height
      )}

      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
        <button 
          onClick={toggleStart}
          className="btn-primary"
          style={{ flex: 2, padding: '0.4rem', fontSize: '0.8rem' }}
        >
          {isRunning ? '一時停止' : (timeLeft > 0 ? '再開' : 'スタート')}
        </button>
        <button 
          onMouseDown={startLongPress}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          title="長押しでリセット"
        >
          停止
        </button>
      </div>
    </div>
  );
};

export const Timer: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '0.75rem', 
      width: '100%',
      justifyContent: 'center',
      padding: '0.5rem 0'
    }}>
      <TimerInstance />
      <TimerInstance />
    </div>
  );
};
