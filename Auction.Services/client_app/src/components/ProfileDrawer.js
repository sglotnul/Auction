import React, {useCallback, useContext, useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import useProfile from "../hooks/useProfile";
import ErrorContext from "../contexts/ErrorContext";
import {getUserFullName} from "../models/functions";

const ProfileDrawer = ({isOpen, onClose}) => {
    const navigate = useNavigate();
    
    const { addError } = useContext(ErrorContext);
    const { user, logout } = useContext(AuthContext);
    
    const [profile, loading, errorCode] = useProfile(user?.userName, user && isOpen);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);
    
    const onLogout = useCallback(async () => {
        const error = await logout();
        
        if (error) {
            addError(error);
        }
        else {
            onClose();
            navigate('/');
        }
    }, []);

    const auctionLink = () => user.role === 1 || user.role === 3 ? <Link className="profile-drawer-link" to="/profile?tab=1" onClick={onClose}>Мои лоты</Link> : null;
    const adminLink = () => user.role === 3 ? <Link className="profile-drawer-link" target="_blank" to="/admin" onClick={onClose}>Администрирование</Link> : null;
    
    return (
        <Drawer
            anchor='right'
            open={isOpen}
            onClose={onClose}
        >
            {
                !loading && user
                ? (
                    <div className="profile-drawer">
                        <div className="profile-drawer-content">
                            <div className="profile-drawer-user-name"><span className="profile-icon auction-owner-icon"/>{getUserFullName(user.userName, profile)}</div>
                            <Link className="profile-drawer-link" to="/profile?tab=0" onClick={onClose}>Мой профиль</Link>
                            <Link className="profile-drawer-link" to="/profile?tab=2" onClick={onClose}>Мои консультации</Link>
                            {auctionLink()}
                            {adminLink()}
                        </div>
                        <Button onClick={onLogout} variant="contained" fullWidth color="error">
                            Выйти
                        </Button>
                    </div>
                )
                : (
                        <div className="profile-drawer">
                            <div className="loading-layout" style={{height: '50px'}}/>
                            <div className="loading-layout" style={{height: '30px'}}/>
                            <div className="loading-layout" style={{height: '30px'}}/>
                            <div className="loading-layout" style={{height: '30px'}}/>
                            <div className="loading-layout" style={{height: '30px'}}/>
                        </div>
                    )
            }
        </Drawer>
    );
};

export default ProfileDrawer;