import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import AuthContext from "../contexts/AuthContext";

const AuctionCard = ({auction, children}) => {
    const profile = auction.user.profile;
    
    return (
        <div className='auction-card'>
            <span className="auction-card-title">{auction.title}</span>
            <Link className="auction-card-inner-link auction-card-student" to="/auctions">{getUserFullName(auction.user.userName, profile)}</Link>
            {children}
        </div>
    )
}

function getUserFullName(userName, profile){
    if (!profile?.firstName && !profile?.lastName) {
        return userName;
    }
    
    return `${profile?.firstName} ${profile?.lastName}`.trim();
}

export default AuctionCard;