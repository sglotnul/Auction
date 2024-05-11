import React, {useContext} from 'react';
import Drawer from '@mui/material/Drawer';
import AuthContext from "../contexts/AuthContext";
import {Button} from "@mui/material";

const ProfileDrawer = ({isOpen, onClose}) => {
    const { user, logout } = useContext(AuthContext);
    
    return (
        <Drawer
            anchor='right'
            open={isOpen}
            onClose={onClose}
        >
            <div className="profile-drawer">
                <h1>Hi, {user.userName}</h1>
                <Button onClick={logout}>
                    Log Out
                </Button>
            </div>
        </Drawer>
    );
};

export default ProfileDrawer;