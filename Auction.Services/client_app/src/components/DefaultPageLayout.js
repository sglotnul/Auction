import React, {Fragment, useEffect, useState} from 'react';
import ProfileBar from "./ProfileBar";
import {Link} from "react-router-dom";
import ErrorSnackbar from "./ErrorSnackbar";

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

const DefaultPageLayout = ({ errorCode, children }) => {
    const [errorCodes, setErrorCodes] = useState([]);
    
    useEffect(() => {
        if (!errorCode){
            setErrorCodes([]);
            return;
        }
        
        if (errorCodes.length < 5) {
            setErrorCodes(prev => [...prev, errorCode]);
        }
    }, [errorCode]);

    const handleClose = (id) => () => {
        setErrorCodes(prev => prev.filter(error => error.id !== id));
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