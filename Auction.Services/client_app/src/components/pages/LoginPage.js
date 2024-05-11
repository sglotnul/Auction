import React, {useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import AuthContext from '../../contexts/AuthContext';
import DefaultPageLayout from "../DefaultPageLayout";

const LoginPage = () => {
    const navigate = useNavigate();

    const { user, login } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    if (user){
        navigate('/auctions');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errorMessage = await login(username, password);

        if (errorMessage) {
            setError(errorMessage);
        }
    };

    return (
        <DefaultPageLayout>
            <form onSubmit={handleSubmit}>
                {error && <p>{error}</p>}
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    required
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required
                />
                <button type='submit'>Login</button>
            </form>
        </DefaultPageLayout>
    );
};

export default LoginPage;
