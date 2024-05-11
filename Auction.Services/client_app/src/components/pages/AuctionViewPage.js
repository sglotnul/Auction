import React from 'react';
import {useParams} from "react-router-dom";
import DefaultPageLayout from "../DefaultPageLayout";
import useAuction from "../../hooks/useAuction";
import AuctionCard from "../AuctionCard";

const AuctionViewPage = () => {
    const { auctionId } = useParams();

    const [auction, loading, status] = useAuction(auctionId);
    
    if (loading) {
        return (
            <DefaultPageLayout>
                Loading...
            </DefaultPageLayout>
        )
    }
    
    if (!auction) {
        switch (status) {
            case 404:
                return (
                    <DefaultPageLayout>
                        Nothing found
                    </DefaultPageLayout>
                )
            case 500:
                return (
                    <DefaultPageLayout>
                        Internal server error
                    </DefaultPageLayout>
                )
            default:
                return (
                    <DefaultPageLayout>
                        Unexpected error
                    </DefaultPageLayout>
                )
        }
    }

    return (
        <DefaultPageLayout>
            <AuctionCard auction={auction}/>
            <h2>Description:</h2>
            <span>{auction.description}</span>
        </DefaultPageLayout>
    );
};

export default AuctionViewPage;