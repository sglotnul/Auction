import React, {Fragment, useCallback, useContext, useState} from 'react';
import {Link} from "react-router-dom";
import ErrorSnackbar from "./ErrorSnackbar";
import ErrorContext from "../contexts/ErrorContext";
import AuthContext from "../contexts/AuthContext";
import ProfileDrawer from "./ProfileDrawer";

const Header = () => {
    return (
        <header>
            <div className="wrapper">
                <div className="header-container">
                    <Link to="/"><h1>Auction</h1></Link>
                    <ProfileIcon/>
                </div>
            </div>
        </header>
    );
};

const Footer = () => {
    return (
        <footer>
            {/* Содержимое футера */}
        </footer>
    );
};

const DefaultPageLayout = ({ children }) => {
    const {errorCodes, removeError} = useContext(ErrorContext);

    const handleClose = (id) => () => {
        removeError(id);
    };
    
    return (
        <Fragment>
            {errorCodes.map((error) => (
                <ErrorSnackbar key={error.id} message={error.message()} onClose={handleClose(error.id)}/>
            ))}
            <Header/>
            <div className='layout'>
                <div className='wrapper content'>
                    {children}
                </div>
            </div>
            <Footer/>
        </Fragment>
    );
};

const ProfileIcon = () => {
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
                <span className="profile-icon header-icon" src={`${process.env.PUBLIC_URL}/icons/profile-icon.svg`} onClick={showDrawer} />
            );

    return (
        <Fragment>
            {content}
            <ProfileDrawer isOpen={isDrawerOpen} onClose={hideDrawer}/>
        </Fragment>
    )
}

export default DefaultPageLayout;