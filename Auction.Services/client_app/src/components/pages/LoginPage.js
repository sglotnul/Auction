import React, {useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';
import {Button, TextField} from "@mui/material";
import ErrorContext from "../../contexts/ErrorContext";

const LoginPage = () => {
    const navigate = useNavigate();

    const { addError } = useContext(ErrorContext);
    const { user, loading, login } = useContext(AuthContext);

    const [username, setUsername] = useState(undefined);
    const [password, setPassword] = useState(undefined);

    if (loading) {
        return (
            <div className="default-container">
                <div className="loading-layout" style={{height: '130px'}}/>
            </div>
        );
    }

    if (user) {
        navigate('/');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const error = await login(username, password);

        if (error) {
            addError(error);
        }
    };

    return (
        <div className="default-container">
            <form onSubmit={handleSubmit}>
                <div className="default-input-container">
                    <TextField
                        label="Имя пользователя"
                        name="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Пароль"
                        name="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    </div>
                <Button type="submit" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;
