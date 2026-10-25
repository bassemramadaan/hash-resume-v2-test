import React, { useState, useEffect } from 'react';

interface AnimatedScoreCounterProps {
  targetScore: number;
  duration?: number;
  className?: string;
  showPercent?: boolean;
}

export const AnimatedScoreCounter: React.FC<AnimatedScoreCounterProps> = ({
  targetScore,
  duration = 1100,
  className = '',
  showPercent = true,
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = Math.max(0, Math.min(targetScore, 10)); // gentle quick start
    const diff = targetScore - startValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic: fast start, soft gentle landing
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startValue + diff * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [targetScore, duration]);

  return (
    <span className={`tabular-nums font-bold font-mono tracking-tight ${className}`}>
      {displayScore}{showPercent ? '%' : ''}
    </span>
  );
};
