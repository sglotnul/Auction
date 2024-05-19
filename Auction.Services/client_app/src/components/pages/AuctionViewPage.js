import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import useAuction from "../../hooks/useAuction";
import AuctionCard from "../AuctionCard";
import {Button, Modal, TextField} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import ErrorCode from "../../models/ErrorCode";
import ErrorContext from "../../contexts/ErrorContext";
import NumericStepper from "../NumericStepper";
import useBids from "../../hooks/useBids";
import {Iso} from "@mui/icons-material";

const AuctionViewPage = () => {
    const { addError } = useContext(ErrorContext);
    
    const { auctionId } = useParams();

    const [auction, loading, errorCode] = useAuction(auctionId);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);
    
    if (loading) {
        return (
            <div className="default-container">
                ...Loading
            </div>
        );
    }
    
    if (!auction) {
        return (
            <div className="default-container">
                Error.
            </div>  
        );
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
    
    const handleStepperChange = (value) => {
        setFormData({ ...formData, amount: value });
    }
    
    return (
        <Fragment>
            <Button variant="contained" onClick={handleOpen}>Bid</Button>
            <Modal
                open={isOpen}
                onClose={handleClose}
            >
                <div className="default-modal-container">
                    <form onSubmit={handleSubmit}>
                        <Stepper auction={auction} isOpen={isOpen} onChange={handleStepperChange}/>
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

const Stepper = ({auction, isOpen, onChange}) => {
    const { addError } = useContext(ErrorContext);
    
    const [bids, bidsLoading, errorCode] = useBids(auction.id, isOpen);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);
    
    if (bidsLoading) {
        return '...Loading';
    }
    
    return (
        <NumericStepper maxValue={bids.currentPrice} minValue={0} initialValue={bids.currentPrice} step={10} onChange={onChange} />
    );
}

export default AuctionViewPage;