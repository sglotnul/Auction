import React, {useContext, useState} from 'react';
import DefaultPageLayout from "../DefaultPageLayout";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

const RegisterPage = () => {
    const navigate = useNavigate();

    const { user, register } = useContext(AuthContext);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('1');

    if (user){
        navigate('/auctions');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await register(username, password, parseInt(role));
    };

    return (
        <DefaultPageLayout>
            <form onSubmit={handleSubmit}>
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
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value='1'>Student</option>
                    <option value='2'>Consultant</option>
                </select>
                <button type='submit'>Sing Up</button>
            </form>
        </DefaultPageLayout>
    );
};

export default RegisterPage;
