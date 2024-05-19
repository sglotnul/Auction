import React, { useState, useEffect } from 'react';
import {Box, Typography, Button, TextField} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const NumericStepper = ({ initialValue, minValue, maxValue, step, onChange }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        onChange(value);
    }, [value, onChange]);

    const handleIncrement = () => setValue((prevValue) => Math.min(prevValue + step, maxValue));
    const handleDecrement = () => setValue((prevValue) => Math.max(prevValue - step, minValue));

    const handleInputChange = (event) => {
        const newValue = parseFloat(event.target.value);
        if (!isNaN(newValue) && newValue >= minValue && newValue <= maxValue) {
            setValue(newValue);
        }
    };

    const decrementDelta = value - minValue >= step ? step : value - minValue;
    const incrementDelta = maxValue - value >= step ? step : maxValue - value;

    return (
        <div className="default-stepper">
            <div className="stepper-arrow-container">
                <Button onClick={handleDecrement} disabled={value <= minValue}>
                    <Typography variant="caption">-{decrementDelta.toFixed(2)}</Typography>
                    <KeyboardArrowLeftIcon />
                </Button>
            </div>
            <TextField
                value={value.toFixed(2)}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                inputProps={{ style: { textAlign: 'center' } }}
                sx={{margin: '0 12px' }}
            />
            <div className="stepper-arrow-container">
                <Button onClick={handleIncrement} disabled={value >= maxValue}>
                    <KeyboardArrowRightIcon />
                    <Typography variant="caption">+{incrementDelta.toFixed(2)}</Typography>
                </Button>
            </div>
        </div>
    );
};

export default NumericStepper;
