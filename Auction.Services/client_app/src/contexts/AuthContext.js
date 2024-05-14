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
            
            const fetchedUser = await tryGetUser();
            setUser(fetchedUser);

            setLoading(false);
        };

        initializeUser();
    }, []);

    const login = useCallback(async (username, password) => {
        setLoading(true);
    
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({username, password})
        });

        if (response.ok) {
            setUser(await response.json());
        }
        else {
            setErrorCode(new ErrorCode(await response.text()));
        }

        setLoading(false);
    },[]);

    const logout = useCallback(async () => {
        setLoading(true);
        
        const response = await fetch('/api/logout', { method: 'POST' });

        if (response.ok) {
            setUser(null);
        }

        setLoading(false);
    },[]);

    const register = useCallback(async (username, password, role) => {
        setLoading(true);

        const response = await fetch('/api/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({username, password, role})
        });

        if (response.ok) {
            setUser(await response.json());
        }

        setLoading(false);
    },[]);

    return (
        <AuthContext.Provider value={{ user, errorCode, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

async function tryGetUser() {
    const response = await fetch('/api/user');
    if (response.ok) {
        return await response.json();
    }
    return null;
}

export default AuthContext;