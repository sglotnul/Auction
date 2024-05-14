import React, {useContext, useState} from 'react';
import {Button, FormControlLabel, RadioGroup, Radio, TextField} from "@mui/material";
import DefaultPageLayout from "../DefaultPageLayout";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

const RegisterPage = () => {
    const navigate = useNavigate();

    const { user, register } = useContext(AuthContext);

    const [tab, setTab] = useState(0);
    const [enabledTab, setEnabledTab] = useState(0);
    const [formData, setFormData] = useState({
        username: null,
        password: null,
        role: '1',
        firstName: null,
        lastName: null,
        gender: null,
        age: null,
        education: null,
        about: null,
    });

    if (user){
        navigate('/auctions');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await register(formData.username, formData.password, parseInt(formData.role));
    };

    const changeTab = (newTab, enableNext = false) => (e) => {
        e.preventDefault();
        
        if (!enableNext && enabledTab < newTab) {
            return;
        }

        setEnabledTab(newTab);
        setTab(newTab);
    };

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    return (
        <DefaultPageLayout>
            <div className="auth-container">
                <div className="tab-bar register-tabs">
                    <div className={enabledTab >= 0 ? 'tab' : 'tab disabled'} onClick={changeTab(0)}>Account</div>
                    <div className={enabledTab >= 1 ? 'tab' : 'tab disabled'} onClick={changeTab(1)}>Role</div>
                    <div className={enabledTab >= 2 ? 'tab' : 'tab disabled'} onClick={changeTab(2)}>Profile</div>
                </div>
                {tab === 0 && (
                    <form onSubmit={changeTab(tab + 1, true)}>
                        <div className="register-input-container">
                            <TextField
                                label="User name"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </div>
                        <Button type="submit" variant="contained" fullWidth>
                            Confirm
                        </Button>
                    </form>
                )}
                {tab === 1 && (
                    <>
                        <div className="register-input-container">
                            <RadioGroup
                                aria-label="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Student" />
                                <FormControlLabel value="2" control={<Radio />} label="Consultant" />
                            </RadioGroup>
                        </div>
                        <Button variant="contained" fullWidth onClick={changeTab(tab + 1, true)}>
                        Confirm
                        </Button>
                    </>
                )}
                {tab === 2 && (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="First name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Last name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Education"
                                name="education"
                                value={formData.education}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="About"
                                name="about"
                                multiline
                                rows={4}
                                value={formData.about}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" fullWidth>
                                Confirm
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </DefaultPageLayout>
    );
};

export default RegisterPage;
