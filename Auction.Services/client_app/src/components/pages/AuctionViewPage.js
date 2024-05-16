import React, {Fragment} from 'react';
import {useParams} from "react-router-dom";
import useAuction from "../../hooks/useAuction";
import AuctionCard from "../AuctionCard";

const AuctionViewPage = () => {
    const { auctionId } = useParams();

    const [auction, loading, status] = useAuction(auctionId);
    
    if (loading) {
        return 'Loading...';
    }
    
    if (!auction) {
        switch (status) {
            case 404:
                return 'Nothing found'
            case 500:
                return 'Internal server error'
            default:
                return 'Unexpected error'
        }
    }

    return (
        <Fragment>
            <AuctionCard auction={auction}/>
            <h2>Description:</h2>
            <span>{auction.description}</span>
        </Fragment>
    );
};

export default AuctionViewPage;