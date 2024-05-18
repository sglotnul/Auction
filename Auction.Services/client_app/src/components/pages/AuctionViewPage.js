import React, {Fragment, useContext} from 'react';
import {useParams} from "react-router-dom";
import useAuction from "../../hooks/useAuction";
import AuctionCard from "../AuctionCard";
import {Button} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";

const AuctionViewPage = () => {
    const { auctionId } = useParams();

    const { user, loading: userLoading } = useContext(AuthContext);

    const [auction, loading, status] = useAuction(auctionId);
    
    if (loading || userLoading) {
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

    const canBid = user?.role === 2 || user?.role === 3;

    return (
        <Fragment>
            <AuctionCard auction={auction}>
                {canBid
                    ? <Button variant="contained">Bid</Button>
                    : null
                }
            </AuctionCard>
            <h2>Description:</h2>
            <span>{auction.description}</span>
        </Fragment>
    );
};

export default AuctionViewPage;