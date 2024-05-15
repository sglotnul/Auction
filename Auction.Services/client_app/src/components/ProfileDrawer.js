import React, {useContext, useEffect} from 'react';
import Drawer from '@mui/material/Drawer';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import useProfile from "../hooks/useProfile";

const ProfileDrawer = ({isOpen, onClose}) => {
    const { user, logout } = useContext(AuthContext);
    
    const [profile, loading] = useProfile();
    
    useEffect(() => console.log('drawer'), []);
    
    if (loading) {
        return (
            <Drawer
                anchor='right'
                open={isOpen}
                onClose={onClose}
            >
                ...Loading
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor='right'
            open={isOpen}
            onClose={onClose}
        >
            <div className="profile-drawer">
                <div className="profile-drawer-content">
                    <h1>{getUserFullName(user.userName, profile)}</h1>
                    <Link to="/profile">Profile</Link>
                </div>
                <Button onClick={logout} variant="contained" fullWidth color="error">
                    Log Out
                </Button>
            </div>
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