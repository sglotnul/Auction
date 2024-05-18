import React, {Fragment, useCallback, useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import useAuction from "../../hooks/useAuction";
import AuctionCard from "../AuctionCard";
import {Button, Modal, TextField} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import ErrorCode from "../../models/ErrorCode";
import ErrorContext from "../../contexts/ErrorContext";

const AuctionViewPage = () => {
    const { auctionId } = useParams();

    const [auction, loading, status] = useAuction(auctionId);
    
    if (loading) {
        return (
            <div className="default-container">
                ...Loading
            </div>
        );
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
        <div className="default-container">
            <AuctionCard auction={auction}>
                <BidButton auction={auction}/>
            </AuctionCard>
            <h2>Description:</h2>
            <span>{auction.description}</span>
        </div>
    );
};

const BidButton = ({auction}) => {
    const { user, loading } = useContext(AuthContext);
    const { addError } = useContext(ErrorContext);
    
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    
    const handleOpen = useCallback(e => setIsOpen(true), []);
    const handleClose = useCallback(e => setIsOpen(false), []);

    if (loading) {
        return 'Loading...';
    }
    
    if (user?.role !== 2 && user?.role !== 3) {
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`/api/auctions/${auction.id}/bid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(formData)
        });

        const responseBody = await response.text();
        if (!response.ok) {
            addError(new ErrorCode(responseBody));
        }
        else {
            handleClose(null);
        }
    };

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    return (
        <Fragment>
            <Button variant="contained" onClick={handleOpen}>Bid</Button>
            <Modal
                open={isOpen}
                onClose={handleClose}
            >
                <div className="default-modal-container">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData?.amount}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Comment"
                            name="comment"
                            value={formData?.comment}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" fullWidth>
                            Confirm
                        </Button>
                    </form>
                </div>
            </Modal>
        </Fragment>
    );
}

export default AuctionViewPage;