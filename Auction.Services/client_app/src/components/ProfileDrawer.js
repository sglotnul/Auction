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

    const auctionLink = () => user.role === 1 || user.role === 3 ? <Link to="/profile?tab=1" onClick={onClose}><h3>My Auctions</h3></Link> : null;
    const adminLink = () => user.role === 3 ? <Link target="_blank" to="/admin" onClick={onClose}><h3>Administration</h3></Link> : null;
    
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
                            <h1>{getUserFullName(user.userName, profile)}</h1>
                            <Link to="/profile?tab=0" onClick={onClose}><h3>Profile</h3></Link>
                            <Link to="/profile?tab=2" onClick={onClose}><h3>My Consultations</h3></Link>
                            {auctionLink()}
                            {adminLink()}
                        </div>
                        <Button onClick={onLogout} variant="contained" fullWidth color="error">
                            Log Out
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