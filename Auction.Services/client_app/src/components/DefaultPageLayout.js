import React, {Fragment} from 'react';
import ProfileBar from "./ProfileBar";
import WebSocketComponent from "./WebSocketComponent";

const Header = () => {
    return (
        <header>
            <div className='wrapper'>
                <div className="header-container">
                    <h1>Auction</h1>
                    <ProfileBar/>
                    <WebSocketComponent/>
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
    return (
        <Fragment>
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