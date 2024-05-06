import { createContext, useEffect, useState } from 'react';
import { User } from "../models/User";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initializeUser = async () => {
            const fetchedUser = await tryGetUser();
            setUser(fetchedUser);
        };

        initializeUser();
    }, []);

    const login = async (username, password) => {
        const response = await fetch('api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok){
            const json = await response.json();
            setUser(getUserFromResponse(json));
        }

        return { success: response.ok, errorMessage: mapMessage(response.status) };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

async function tryGetUser() {
    const response = await fetch('api/user');
    if (response.ok) {
        const json = await response.json();
        return getUserFromResponse(json);
    }
    return null;
}

function getUserFromResponse(r) {
    return new User(r.userId, r.userName, r.role);
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
