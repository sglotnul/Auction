import React, {Fragment, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import useAuction from "../../hooks/useAuction";
import {Button, Modal, TextField} from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import ErrorCode from "../../models/ErrorCode";
import ErrorContext from "../../contexts/ErrorContext";
import NumericStepper from "../NumericStepper";
import useBids from "../../hooks/useBids";
import {getUserFullName, formatDate} from "../../models/functions";
import CategoriesView from "../CategoriesView";
import Timer from "../Timer";

const AuctionViewPage = () => {
    const { addError } = useContext(ErrorContext);
    
    const { auctionId } = useParams();

    const [auction, loading, errorCode] = useAuction(auctionId);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    return (
        <div className="auction-page">
            <AuctionView auction={auction} auctionLoading={loading} />
            <BidList auction={auction} auctionLoading={loading}/>
        </div>
    );
};

const AuctionView = ({auction, auctionLoading}) => {
    if (auctionLoading) {
        return (
            <div className="auction-container">
                <div className="loading-layout" style={{height: '130px'}}/>
            </div>
        );
    }
    
    if (!auction) {
        return (
            <div className="auction-container">
                Error.
            </div>
        );
    }
    
    return (
        <div className="auction-container">
            <Link to={`/profile/${auction.user.userName}`}>
                <div className="auction-owner-view">
                    <span className="profile-icon auction-owner-icon"/>
                    <span>{getUserFullName(auction.user.userName, auction.user.profile)}</span>
                </div>
            </Link>
            <h2>{auction.title}</h2>
            <div className="auction-description-row">
                {formatDate(auction.startAt)}
            </div>
            <div className="auction-description-row">
                <CategoriesView categories={auction.categories}/>
            </div>
            <Description description={auction.description} />
        </div>
    )
}

const BidList = ({auction, auctionLoading}) => {
    const {addError} = useContext(ErrorContext);
    const {user, loading: userLoading} = useContext(AuthContext);
    
    const [bids, loading, errorCode, reload] = useBids(auction?.id, !!auction);
    
    const [buttonVisible, setButtonVisible] = useState(false);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    useEffect(() => {
        if (!auctionLoading)
            setButtonVisible(auction.user.userId !== user?.userId && (user?.role === 2 || user?.role === 3));
    }, [auction, user]);
    
    const onTimeEnd = useCallback(() => {
        setButtonVisible(false);
    }, []);

    if (!auctionLoading && !auction) {
        return (
            <div className="auction-bids">
                Error.
            </div>
        );
    }

    if (auctionLoading || loading || userLoading) {
        return (
            <div className="auction-bids">
                <div className="loading-layout" style={{height: '55px'}}/>
                <div className="loading-layout" style={{height: '55px'}}/>
                <div className="loading-layout" style={{height: '55px'}}/>
            </div>
        );
    }
    
    const currentPrice = bids.currentPrice ?? auction.initialPrice;
    const endTime = new Date(auction.endAt);
    const showTimer = new Date() < endTime

    return (
        <div className="auction-bids">
            {showTimer && <Timer endTime={endTime} onEnd={onTimeEnd} />}
            <BidButton auctionId={auction.id} visible={buttonVisible} currentPrice={currentPrice} minDecrease={auction.minDecrease} onAction={reload}/>
            {!bids.bids?.length && <div className="no-bids">no bids</div>}
            {bids.bids?.map((b, i) => (
                <Fragment key={b.id}>
                    <div className="auction-bid-container">
                        <Link to={`/profile/${b.user.userName}`}><span
                            className="profile-icon auction-bid-icon"/></Link>
                        <div className="auction-bid-content">
                            <Link to={`/profile/${b.user.userName}`}><span>{b.user.userName}{b.user.userId === user?.userId && ' (You)'}</span></Link>
                            <span className="auction-bid-amount">{b.amount.toFixed(2)}</span>
                            <span className="auction-bid-comment">{b.comment}</span>
                        </div>
                    </div>
                    {i === 0 && (<div className="current-bid-separator">Current bid</div>)}
                </Fragment>
            ))}
        </div>
    );
}

const BidButton = ({auctionId, visible, currentPrice, minDecrease, onAction}) => {
    const { addError } = useContext(ErrorContext);
    
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    
    const handleOpen = useCallback(e => setIsOpen(true), []);
    const handleClose = useCallback(e => setIsOpen(false), []);
    
    if (!visible) {
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`/api/auctions/${auctionId}/bid`, {
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
            onAction();
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
            <Button disabled={currentPrice === 0} variant="contained" onClick={handleOpen} fullWidth>{currentPrice === 0 ? 'Unable to bid' : 'Bid'}</Button>
            <Modal
                open={isOpen}
                onClose={handleClose}
            >
                <div className="default-modal-container">
                    <form onSubmit={handleSubmit}>
                        <NumericStepper maxValue={currentPrice - minDecrease} minValue={0} initialValue={currentPrice - minDecrease} step={minDecrease} onChange={handleStepperChange} />
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

const Description = ({ description }) => {
    const lines = description.split('\n');

    return (
        <div className="auction-description-row">
            {lines.map((line, index) => (
                <span style={{display: 'block'}} key={index}>{line}</span>
            ))}
        </div>
    );
};

export default AuctionViewPage;