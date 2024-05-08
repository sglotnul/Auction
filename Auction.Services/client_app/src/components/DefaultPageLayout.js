import React, {Fragment} from 'react';
import ProfileBar from "./ProfileBar";

const Header = () => {
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
                <div className='layout'>
                    {children}
                </div>
            <Footer/>
        </Fragment>
    );
};

export default DefaultPageLayout;