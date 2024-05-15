import ProfileDrawer from "./ProfileDrawer";
import React, {Fragment, useCallback, useContext, useEffect, useState} from "react";
import AuthContext from "../contexts/AuthContext";
import {Link} from "react-router-dom";

const ProfileBar = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const { loading: userLoading, user } = useContext(AuthContext);

	const toggleDrawer = (open) => (event) => {
		if (!event){
			return;
		}
		
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setIsDrawerOpen(open);
	};

	const showDrawer = useCallback(toggleDrawer(true), []);
	const hideDrawer = useCallback(toggleDrawer(false), []);

	if (userLoading) {
		return null;
	}

	if (!user) {
		return (
			<div style={{display: 'inline'}}>
				<Link to='/register'>Sing Up      </Link>
				<Link to='/login'>Sing In</Link>
			</div>
		)
	}

	return (
		<Fragment>
			<div onClick={showDrawer}>
				Hello, {user.userName}!
			</div>
			<ProfileDrawer isOpen={isDrawerOpen} onClose={hideDrawer}/>
		</Fragment>
	)
}

export default ProfileBar;