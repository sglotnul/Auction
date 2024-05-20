import React, {useContext, useEffect} from "react";
import AuthContext from "../../contexts/AuthContext";
import {Link, useNavigate, useParams} from "react-router-dom";
import AuctionCard from "../AuctionCard";
import {Button} from "@mui/material";
import useUserAuctions from "../../hooks/useUserAuctions";
import ErrorContext from "../../contexts/ErrorContext";

const UserAuctionPage = () => {
    const navigate = useNavigate();
    
    const {userName} = useParams();
    
    const {addError} = useContext(ErrorContext);
    const {user, loading} = useContext(AuthContext);
    
    const [auctions, auctionsLoading, errorCode] = useUserAuctions(userName || user?.userName, !!(user || userName));

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    if (!userName && !user) {
        navigate('/');
    }
    
    if (loading || auctionsLoading) {
        return (
            <div className="auctions-page">
                ...Loading
            </div>
        );
    }
    
    const canEdit = !userName || userName.toLowerCase() === user?.userName.toLowerCase();
    
    return (
        <div className="profile-page-content">
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