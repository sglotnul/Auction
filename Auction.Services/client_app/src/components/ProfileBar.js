import ProfileDrawer from "./ProfileDrawer";
import React, {Fragment, useCallback, useContext, useState} from "react";
import AuthContext from "../contexts/AuthContext";
import {Link} from "react-router-dom";

const ProfileBar = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const { loading: userLoading, user } = useContext(AuthContext);

	const toggleDrawer = useCallback((open) => (event) => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setIsDrawerOpen(open);
	}, []);

	if (userLoading) {
		return null;
	}

	if (!user) {
		return (
			<div style={{display: 'inline'}}>
				<Link to='/login'>Sing Up      </Link>
				<Link to='/login'>Sing In</Link>
			</div>
		)
	}

	return (
		<Fragment>
			<div onClick={toggleDrawer(true)}>
				Hello, {user.userName}!
			</div>
			<ProfileDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer}/>
		</Fragment>
	)
}

export default ProfileBar;