import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import CategoriesView from "./CategoriesView";

const AuctionCard = ({auction, children}) => {
    const profile = auction.user.profile;
    
    return (
        <div className='auction-card'>
            <Link to={`/auctions/${auction.id}`}><span className="auction-card-title">{auction.title}</span></Link>
            <Link className="auction-card-inner-link auction-card-student" to={`/profile/${auction.user.userName}`}>{getUserFullName(auction.user.userName, profile)}</Link>
            <CategoriesView categories={auction.categories} />
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