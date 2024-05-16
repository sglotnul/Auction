import React, {Fragment, useContext} from 'react';
import ProfileBar from "./ProfileBar";
import {Link} from "react-router-dom";
import ErrorSnackbar from "./ErrorSnackbar";
import ErrorContext from "../contexts/ErrorContext";
import AuthContext from "../contexts/AuthContext";

const Header = () => {
    return (
        <header>
            <div className="wrapper">
                <div className="header-container">
                    <Link to="/"><h1>Auction</h1></Link>
                    <ProfileBar/>
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
    console.log(useContext(ErrorContext));
    console.log(useContext(AuthContext));
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
                <div className='wrapper'>
                    {children}
                </div>
            </div>
            <Footer/>
        </Fragment>
    );
};

export default DefaultPageLayout;