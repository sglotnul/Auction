import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import ErrorSnackbar from "./ErrorSnackbar";
import ErrorContext from "../contexts/ErrorContext";
import AuthContext from "../contexts/AuthContext";
import ProfileDrawer from "./ProfileDrawer";

const Header = () => {
    return (
        <header>
            <div className="wrapper">
                <div className="header-container">
                    <Link to="/"><h1>Аукцион</h1></Link>
                    <ProfileIcon/>
                </div>
            </div>
        </header>
    );
};

const Footer = () => {
    return (
        <footer>
            <div className="wrapper">
                <Link to="/"><h1>Аукцион</h1></Link>
            </div>
        </footer>
    );
};

const DefaultPageLayout = ({ children }) => {
    const { pathname } = useLocation();
    
    const {errorCodes, removeError} = useContext(ErrorContext);

    const handleClose = (id) => () => {
        removeError(id);
    };

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [pathname]);
    
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
                <div className="sing-in-bar">
                    <Link className="sing-up-link" to='/register'>Регистрация</Link>
                    <Link className="sing-in-link" to='/login'>Вход</Link>
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