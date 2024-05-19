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

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                margin: '0 auto',
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <Button onClick={handleDecrement}>
                    <Typography variant="caption">-{step.toFixed(2)}</Typography>
                    <KeyboardArrowLeftIcon />
                </Button>
            </Box>
            <TextField
                value={value.toFixed(2)}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                inputProps={{ style: { textAlign: 'center' } }}
                sx={{ margin: '0 16px', width: '80px' }}
            />
            <Box display="flex" flexDirection="column" alignItems="center">
                <Button onClick={handleIncrement}>
                    <KeyboardArrowRightIcon />
                    <Typography variant="caption">+{step.toFixed(2)}</Typography>
                </Button>
            </Box>
        </Box>
    );
};

export default NumericStepper;
