import React, {useContext} from 'react';
import Drawer from '@mui/material/Drawer';
import {AuthContext} from "../contexts/AuthContext";

const ProfileDrawer = ({isOpen, toggleDrawer}) => {
    const { user } = useContext(AuthContext);
    
    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={toggleDrawer(false)}
        >
            Hi, {user.userName}
        </Drawer>
    );
};

export default ProfileDrawer;