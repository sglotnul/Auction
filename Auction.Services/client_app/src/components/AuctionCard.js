import React from 'react';
import {Link} from "react-router-dom";
import CategoriesView from "./CategoriesView";

const AuctionCard = ({auction, children}) => {
    const profile = auction.user.profile;
    
    return (
        <div className='auction-card'>
            <div className="auction-card-row">
                <Link className="auction-card-inner-link" to={`/auctions/${auction.id}`}>
                    <span className="auction-card-title">
                        {auction.title}
                    </span>
                </Link>
            </div>
            <div className="auction-card-row">
                <Link className="auction-card-inner-link" to={`/profile/${auction.user.userName}`}>
                    <span className="auction-card-student">
                        {getUserFullName(auction.user.userName, profile)}
                    </span>
                </Link>
            </div>
            <div className="auction-card-row">
                <CategoriesView categories={auction.categories} />
            </div>
            {auction.currentBid && (
                <div className="auction-card-bid-view">
                    <div className="auction-bid-container">
                        <Link to={`/profile/${auction.currentBid.user.userName}`}><span
                            className="profile-icon auction-bid-icon"/></Link>
                        <div className="auction-bid-content">
                            <Link
                                to={`/profile/${auction.currentBid.user.userName}`}><span>{auction.currentBid.user.userName}</span></Link>
                            <span className="auction-bid-amount">{auction.currentBid.amount.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="current-bid-separator">Current bid</div>
                </div>
            )}
            {children}
        </div>
    )
}

function getUserFullName(userName, profile) {
    if (!profile?.firstName && !profile?.lastName) {
        return userName;
    }

    return `${profile?.firstName} ${profile?.lastName}`.trim();
}

export default AuctionCard;