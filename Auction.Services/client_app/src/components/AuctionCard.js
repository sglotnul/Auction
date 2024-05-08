import React from 'react';

const AuctionCard = ({auction}) => {
    return (
        <div className="auction-card">
            <h1>{auction.id}</h1>
            <h2>{auction.studentUserId}</h2>
        </div>
    )
}

export default AuctionCard;