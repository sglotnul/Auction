import { createContext, useCallback, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

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

        setLoading(false);
        
        const mapMessage = (status) => {
            switch (status) {
                case 200:
                    return null;
                case 401:
                    return 'Invalid user name or password';
                case 500:
                    return 'Internal server error';
                default:
                    return `Unexpected error`;
            }
        }
        
        return mapMessage(response.status);
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
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
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