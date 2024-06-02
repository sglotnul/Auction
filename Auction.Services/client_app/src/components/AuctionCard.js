import React from 'react';
import {Link} from "react-router-dom";
import CategoriesView from "./CategoriesView";
import {formatTimeRemaining} from "../models/functions";

const AuctionCard = ({auction, children}) => {
    const profile = auction.user.profile;
    
    const isActive = new Date(auction.endAt) > new Date();
    
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
            {auction.currentBid ? 
                (
                    <div className="auction-card-status-view">
                        <div className="auction-bid-container">
                            <Link to={`/profile/${auction.currentBid.user.userName}`}><span
                                className="profile-icon auction-bid-icon"/></Link>
                            <div className="auction-bid-content">
                                <Link
                                    to={`/profile/${auction.currentBid.user.userName}`}><span>{getUserFullName(auction.currentBid.user.userName, auction.currentBid.user.profile)}</span></Link>
                                <span className="auction-bid-amount">{auction.currentBid.amount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="current-bid-separator">Current bid</div>
                    </div>
                )
                : <div className="auction-card-status-view"><div className="no-bids">no bids</div></div>
            }
            {isActive && (
                <div className="auction-card-remaining-time">
                    <span>
                        {formatTimeRemaining(auction.endAt)}
                    </span>
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