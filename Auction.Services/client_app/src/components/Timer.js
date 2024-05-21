import React, { useState, useEffect } from 'react';

const Timer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    function calculateTimeLeft() {
        const now = new Date();
        const difference = endTime - now;

        if (difference <= 0) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const hours = Math.floor((difference / 1000 / 60 / 60) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { hours, minutes, seconds };
    }

    const formatTime = ({ hours, minutes, seconds }) => {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="timer-container">
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div className="timer-text">until the end</div>
        </div>
    );
};

export default Timer;
