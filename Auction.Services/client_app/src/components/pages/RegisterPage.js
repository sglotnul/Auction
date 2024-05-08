import React, { useState } from 'react';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // здесь должна быть логика регистрации пользователя
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
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
                <option value='student'>Student</option>
                <option value='consultant'>Consultant</option>
            </select>
            <button type='submit'>Register</button>
        </form>
    );
};

export default RegisterPage;
