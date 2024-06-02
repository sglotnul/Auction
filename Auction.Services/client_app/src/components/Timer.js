import React, { useState, useEffect } from 'react';

const Timer = ({ endTime, onEnd }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);
    
    useEffect(() => {
        if (timeLeft.hours + timeLeft.minutes + timeLeft.seconds <= 0) {
            onEnd();
        }
    }, [timeLeft]);

    function calculateTimeLeft() {
        const now = new Date();
        const difference = endTime - now;

        if (difference <= 0) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor((difference / 1000 / 60 / 60 / 24));
        const hours = Math.floor((difference / 1000 / 60 / 60 % 24));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { days, hours, minutes, seconds };
    }

    const formatTime = ({ days, hours, minutes, seconds }) => {
        return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="timer-container">
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div className="timer-text">until the end</div>
        </div>
    );
};

export default Timer;
