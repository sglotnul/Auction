import { createContext, useCallback, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initializeUser = async () => {
            const fetchedUser = await tryGetUser();
            setUser(fetchedUser);

            setLoading(false);
        };

        initializeUser();
    }, []);

    const login = useCallback(async (username, password) => {
        setLoading(true);
    
        const response = await fetch('api/login', {
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
        
        return {success: response.ok, errorMessage: mapMessage(response.status)};
    },[]);

    const logout = useCallback(() => {
        setUser(null);
    },[]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

async function tryGetUser() {
    const response = await fetch('api/user');
    if (response.ok) {
        return await response.json();
    }
    return null;
}

function mapMessage(status) {
    switch (status) {
        case 401:
            return 'Неверное имя пользователя или пароль';
        case 500:
            return 'Внутренняя ошибка сервера';
        // Добавьте другие кейсы для разных HTTP статусов, если необходимо
        default:
            return `Ошибка: ${status}`;
    }
}
