import React, {useCallback, useContext, useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import useProfile from "../hooks/useProfile";
import ErrorContext from "../contexts/ErrorContext";

const ProfileDrawer = ({isOpen, onClose}) => {
    const navigate = useNavigate();
    
    const { addError } = useContext(ErrorContext);
    const { user, logout } = useContext(AuthContext);
    
    const [profile, loading] = useProfile(user?.userName, user && isOpen);
    
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

    const newAuctionLink = () => user.role === 1 || user.role === 3 ? <Link to="/auctions/user" onClick={onClose}>My Auctions</Link> : null;
    
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
                            <Link to="/profile/edit" onClick={onClose} fullWidth>Profile</Link>
                            {newAuctionLink()}
                        </div>
                        <Button onClick={onLogout} variant="contained" fullWidth color="error">
                            Log Out
                        </Button>
                    </div>
                )
                : (
                    <div className="profile-drawer">...Loading</div>
                )
            }
            
        </Drawer>
    );
};

function getUserFullName(userName, profile){
    if (!profile?.firstName && !profile?.lastName) {
        return userName;
    }

    return `${profile?.firstName} ${profile?.lastName}`.trim();
}


export default ProfileDrawer;