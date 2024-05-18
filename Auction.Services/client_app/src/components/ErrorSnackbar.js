import React, {useCallback, useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ErrorSnackbar = ({ message, onClose }) => {
    const [open, setOpen] = useState(true);
    
    const close = useCallback((_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setOpen(false);
        
        onClose();
    }, [onClose]);
    
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={open}
            autoHideDuration={2000}
            onClose={close}
        >
            <MuiAlert onClose={close} severity="error" sx={{ width: '100%' }}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default ErrorSnackbar;
