import React, {Fragment, useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import ProfileBar from "./ProfileBar";

const Header = () => {
    const { loading: userLoading } = useContext(AuthContext);
    
    if (userLoading) {
        return null;
    }

    return (
        <header>
            <h1>Auction</h1>
            <ProfileBar/>
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
    return (
        <Fragment>
            <Header/>
                <div className="layout">
                    {children}
                </div>
            <Footer/>
        </Fragment>
    );
};

export default DefaultPageLayout;