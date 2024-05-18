import React, {useContext, useMemo} from "react";
import AuthContext from "../../contexts/AuthContext";
import useAuctions from "../../hooks/useAuctions";
import AuctionsFilter from "../../models/AuctionsFilter";
import {Link, useNavigate, useParams} from "react-router-dom";
import AuctionCard from "../AuctionCard";
import {Button} from "@mui/material";

const UserAuctionPage = () => {
    const navigate = useNavigate();
    
    const {userName} = useParams();
    
    const {user, loading, errorCode} = useContext(AuthContext);
    
    const filter = useMemo(() => new AuctionsFilter([], userName || user?.userName), [userName, user]);
    
    const [auctions, _, auctionsLoading] = useAuctions(filter, !!user || !!userName);

    if (!userName && errorCode) {
        navigate('/');
    }
    
    if (loading || auctionsLoading) {
        return (
            <div className="auctions-page">
                ...Loading
            </div>
        );
    }
    
    if (!userName && !user) {
        return (
            <div className="auctions-page">
                Nothing found
            </div>
        );
    }
    
    const canEdit = !userName || userName.toLowerCase() === user?.userName.toLowerCase();
    
    return (
        <div className="auction-default-list">
            {auctions.length > 0
                ? auctions.map(
                    (auction) => (
                        <Link className="auction-card-outer-link" to={`/auctions/${auction.id}`}>
                            <AuctionCard key={auction.id} auction={auction}>
                                {canEdit
                                    ? <Link to={`/auctions/${auction.id}/edit`}><Button variant="contained">Edit</Button></Link>
                                    : null
                                }
                            </AuctionCard>
                        </Link>
                    )
                )
                : 'Nothing found'
            }
        </div>
    );
}

export default UserAuctionPage;