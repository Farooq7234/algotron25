'use client';
import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ✅ Update date to April 25, 2025
const calculateTimeLeft = (): TimeLeft => {
  const targetDate = '2025-04-25T00:00:00'; // ISO format
  const targetTime = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const timeDifference = targetTime - now;

  if (timeDifference > 0) {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateAndSetTimeLeft = () => {
      const calculatedTimeLeft = calculateTimeLeft();
      setTimeLeft(calculatedTimeLeft);
    };

    calculateAndSetTimeLeft(); // initial call

    const timerInterval = setInterval(() => {
      calculateAndSetTimeLeft();
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <section className="timer-container">
      <section className="timer absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="timer-class">
          <div className="flex font-space gap-1 text-7xl sm:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-[#AAAAAA]">
            <div className="flex flex-col gap-2 text-center">
              <span>{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-sm lg:text-lg">Days</span>
            </div>
            <span>:</span>
            <div className="flex flex-col gap-2 text-center">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-sm lg:text-lg">Hours</span>
            </div>
            <span>:</span>
            <div className="flex flex-col gap-2 text-center">
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-sm lg:text-lg">Minutes</span>
            </div>
            <span>:</span>
            <div className="flex flex-col gap-2 text-center">
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-sm lg:text-lg">Seconds</span>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Timer;
