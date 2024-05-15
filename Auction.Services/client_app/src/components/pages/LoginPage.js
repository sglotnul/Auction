import React, {useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';
import DefaultPageLayout from "../DefaultPageLayout";
import {Button, TextField} from "@mui/material";

const LoginPage = () => {
    const navigate = useNavigate();

    const { user, login } = useContext(AuthContext);

    const [username, setUsername] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [errorCode, setErrorCode] = useState(undefined);
    
    if (user) {
        navigate('/auctions');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const error = await login(username, password);

        if (error) {
            setErrorCode(error);
        }
        else {
            setErrorCode(undefined);
        }
    };

    return (
        <DefaultPageLayout errorCode={errorCode}>
            <div className="auth-container">
                <form onSubmit={handleSubmit}>
                    <div className="register-input-container">
                        <TextField
                            label="User name"
                            name="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Password"
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
                        Login
                    </Button>
                </form>
            </div>
        </DefaultPageLayout>
    );
};

export default LoginPage;
