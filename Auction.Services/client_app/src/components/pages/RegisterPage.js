import React, {useContext, useState} from 'react';
import {Button, TextField, InputLabel, Select, MenuItem} from "@mui/material";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import ErrorContext from "../../contexts/ErrorContext";
import ErrorCode from "../../models/ErrorCode";

const RegisterPage = () => {
    const navigate = useNavigate();

    const { addError } = useContext(ErrorContext);
    const { user, loading, register } = useContext(AuthContext);

    const [tab, setTab] = useState(0);
    const [enabledTab, setEnabledTab] = useState(0);
    const [userFormData, setUserFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 1
    });
    const [profileFormData, setProfileFormData] = useState(undefined);
    
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

        const error = await register(userFormData.username, userFormData.password, userFormData.role, profileFormData);

        if (error) {
            addError(error);
        }
    };

    const changeTab = (newTab, enableNext = false) => (e) => {
        e.preventDefault();
        
        if (userFormData.password !== userFormData.confirmPassword) {
            addError(new ErrorCode('PasswordConfirmationFailed'));
            return;
        }
        
        if (!enableNext && enabledTab < newTab) {
            return;
        }

        setEnabledTab(newTab);
        setTab(newTab);
    };

    const handleInputChange = (event) => {
        const regex = /^[a-zA-Z0-9@._-]*$/;
        
        setUserFormData(prev => {
            let value = event.target.value;
            
            if (!regex.test(value)) {
                value = prev[event.target.name];
            }
            
            return { ...prev, [event.target.name]: value }
        });
    };
    
    const handleProfileInputChange = (event) => {
        let prevData = profileFormData;
        if (!prevData) {
            prevData = {};
        }
        
        setProfileFormData( { ...prevData, [event.target.name]: event.target.value });
    }
    
    return (
        <div className="default-container">
            <div className="tab-bar default-tabs">
                <div className={enabledTab >= 0 ? 'tab' : 'tab disabled'} onClick={changeTab(0)}>Account</div>
                <div className={enabledTab >= 1 ? 'tab' : 'tab disabled'} onClick={changeTab(1)}>Role</div>
                <div className={enabledTab >= 2 ? 'tab' : 'tab disabled'} onClick={changeTab(2)}>Profile</div>
            </div>
            {tab === 0 && (
                <form onSubmit={changeTab(tab + 1, true)}>
                    <div className="default-input-container">
                        <TextField
                            label="User name"
                            name="username"
                            value={userFormData.username}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={userFormData.password}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Confirm password"
                            name="confirmPassword"
                            type="password"
                            value={userFormData.confirmPassword}
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
                <form onSubmit={changeTab(tab + 1, true)}>
                    <div className="default-input-container">
                        <InputLabel id="select-label">Choose role</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select"
                            name="role"
                            value={userFormData.role}
                            onChange={handleInputChange}
                            label="Role"
                            fullWidth
                        >
                            <MenuItem value={1}>Student</MenuItem>
                            <MenuItem value={2}>Consultant</MenuItem>
                        </Select>
                    </div>
                    <Button type="submit" variant="contained" fullWidth>
                        Confirm
                    </Button>
                </form>
            )}
            {tab === 2 && (
                <form onSubmit={handleSubmit}>
                    <div className="default-input-container">
                        <TextField
                            label="Email"
                            name="email"
                            value={profileFormData?.email}
                            onChange={handleProfileInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="First name"
                            name="firstName"
                            value={profileFormData?.firstName}
                            onChange={handleProfileInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Last name"
                            name="lastName"
                            value={profileFormData?.lastName}
                            onChange={handleProfileInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            label="Birth date"
                            name="birthDate"
                            type="date"
                            value={profileFormData?.birthDate}
                            onChange={handleProfileInputChange}
                            margin="normal"
                        />
                        <TextField
                            label="Education"
                            name="education"
                            value={profileFormData?.education}
                            onChange={handleProfileInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Biography"
                            name="biography"
                            multiline
                            rows={4}
                            value={profileFormData?.biography}
                            onChange={handleProfileInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </div>
                    <Button type="submit" variant="contained" fullWidth>
                        Confirm
                    </Button>
                </form>
            )}
        </div>
    );
};

export default RegisterPage;
