import ProfileDrawer from "./ProfileDrawer";
import React, {Fragment, useCallback, useContext, useState} from "react";
import AuthContext from "../contexts/AuthContext";
import {Link} from "react-router-dom";

const ProfileBar = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const { loading: userLoading, user } = useContext(AuthContext);

	const toggleDrawer = (open) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setIsDrawerOpen(open);
	};

	const showDrawer = useCallback(toggleDrawer(true), []);
	const hideDrawer = useCallback(toggleDrawer(false), []);
	
	const content = userLoading
		? null
		: !user 
			? (
				<div style={{display: 'inline'}}>
					<Link to='/register'>Sing Up      </Link>
					<Link to='/login'>Sing In</Link>
				</div>
			)
			: (
				<div onClick={showDrawer}>
					Hello, {user.userName}!
				</div>
			);

	return (
		<Fragment>
			{content}
			<ProfileDrawer isOpen={isDrawerOpen} onClose={hideDrawer}/>
		</Fragment>
	)
}

export default ProfileBar;