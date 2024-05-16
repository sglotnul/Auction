import React, {useCallback, useContext, useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import useProfile from "../hooks/useProfile";
import ErrorContext from "../contexts/ErrorContext";

const ProfileDrawer = ({isOpen, onClose}) => {
    const { addError } = useContext(ErrorContext);
    const { user, logout } = useContext(AuthContext);
    
    const [updater, setUpdater] = useState({});
    
    const [profile, loading] = useProfile(null, updater);
    
    const onLogout = useCallback(async () => {
        const error = await logout();
        
        if (error) {
            addError(error);
        }
        else {
            onClose();
        }
    }, []);
    
    useEffect(() => {
        if (isOpen)
            setUpdater({});
    }, [isOpen]);
    
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
                            <Link to="/profile" onClick={onClose}>Profile</Link>
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