import React, {useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';
import DefaultPageLayout from "../DefaultPageLayout";
import {Button, TextField} from "@mui/material";

const LoginPage = () => {
    const navigate = useNavigate();

    const { user, errorCode, login } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    if (user){
        navigate('/auctions');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await login(username, password);
    };

    return (
        <DefaultPageLayout>
            <div className="auth-container">
                <form onSubmit={handleSubmit}>
                    <div className="register-input-container">
                        {errorCode && <p>{errorCode.message()}</p>}
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
