import { createContext, useCallback, useEffect, useState } from 'react';
import ErrorCode from "../models/ErrorCode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [errorCode, setErrorCode] = useState(null);

    useEffect(() => {
        const initializeUser = async () => {
            setLoading(true);

            const response = await fetch('/api/user');
            if (response.ok) {
                setUser(await response.json());
            }
            else {
                setErrorCode(new ErrorCode(await response.text()));
            }

            setLoading(false);
        };

        initializeUser();
    }, []);

    const login = useCallback(async (username, password) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({username, password})
        });

        if (response.ok) {
            setUser(await response.json());
            return null;
        }

        const errorCode = await response.text();

        setErrorCode(new ErrorCode(errorCode));
        return new ErrorCode(errorCode);
    },[]);

    const logout = useCallback(async () => {
        const response = await fetch('/api/logout', { method: 'POST' });

        if (response.ok) {
            setUser(null);
            return null;
        }

        const errorCode = await response.text();

        setErrorCode(new ErrorCode(errorCode));
        return new ErrorCode(errorCode);
    },[]);

    const register = useCallback(async (username, password, role, profile) => {
        const response = await fetch('/api/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({username, password, role, profile})
        });

        if (response.ok) {
            setUser(await response.json());
            return null;
        }

        const errorCode = await response.text();
        
        setErrorCode(new ErrorCode(errorCode));
        return new ErrorCode(errorCode);
    },[]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, errorCode }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;