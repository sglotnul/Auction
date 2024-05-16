import { createContext, useCallback, useState } from 'react';

const ErrorContext = createContext(null);

export const ErrorProvider = ({ children }) => {
    const [errorCodes, setErrorCodes] = useState([]);

    const addError = useCallback((errorCode) => {
        if (!errorCode){
            return;
        }

        setErrorCodes(prev => {
            if (prev.length < 5)
                return [...prev, errorCode]

            return prev;
        });
    }, []);

    const removeError = useCallback((id) => {
        setErrorCodes(prev => prev.filter(error => error.id !== id));
    }, []);

    return (
        <ErrorContext.Provider value={{ errorCodes, addError, removeError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export default ErrorContext;