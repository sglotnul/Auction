import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import AuthContext from "../contexts/AuthContext";

const AuctionCard = ({auction}) => {
    const { user } = useContext(AuthContext);
    
    const profile = auction.studentUser.profile;
    
    const bidButton = user?.role === 2 || user?.role === 3
        ? <Button>Bid</Button>
        : null;
    
    return (
        <div className='auction-card'>
            <span className="auction-card-title">{auction.name}</span>
            <Link className="auction-card-inner-link auction-card-student" to="/auctions">{getUserFullName(auction.studentUserId, profile)}</Link>
            {bidButton}
        </div>
    )
}

function getUserFullName(userId, profile){
    if (!profile?.firstName && !profile?.lastName) {
        return `User ${userId}`;
    }
    
    return `${profile?.firstName} ${profile?.lastName}`.trim();
}

export default AuctionCard;