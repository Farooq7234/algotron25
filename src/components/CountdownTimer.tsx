
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / (1000 * 60)) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className="flex justify-center space-x-4 sm:space-x-8 py-6">
      <div className="countdown-item flex flex-col items-center">
        <div className="text-4xl sm:text-6xl font-bold">{formatNumber(days)}</div>
        <div className="text-sm sm:text-base text-gray-300 mt-2">Days</div>
      </div>
      <div className="countdown-item flex flex-col items-center">
        <div className="text-4xl sm:text-6xl font-bold">{formatNumber(hours)}</div>
        <div className="text-sm sm:text-base text-gray-300 mt-2">Hours</div>
      </div>
      <div className="countdown-item flex flex-col items-center">
        <div className="text-4xl sm:text-6xl font-bold">{formatNumber(minutes)}</div>
        <div className="text-sm sm:text-base text-gray-300 mt-2">Minutes</div>
      </div>
      <div className="countdown-item flex flex-col items-center">
        <div className="text-4xl sm:text-6xl font-bold">{formatNumber(seconds)}</div>
        <div className="text-sm sm:text-base text-gray-300 mt-2">Seconds</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
