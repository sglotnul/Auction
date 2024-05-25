import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import ErrorContext from "../contexts/ErrorContext";
import useUserAuctions from "../hooks/useUserAuctions";
import {Link, useNavigate} from "react-router-dom";
import {Button, Checkbox, FormControlLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import AuctionCard from "./AuctionCard";
import ErrorCode from "../models/ErrorCode";

const UserAuctions = ({user, userName}) => {
    const {addError} = useContext(ErrorContext);

    const [auctions, auctionsLoading, errorCode] = useUserAuctions(userName || user?.userName);

    const [checkedItems, setCheckedItems] = useState({
        drafts: true,
        active: true,
        completed: true,
    });

    const splittedAuctions = useMemo(() => {
        return auctions.reduce((acc, item) => {
            if (item.status === 1) {
                acc.drafts.push(item);
            }
            else if (item.status === 2) {
                if (new Date(item.endAt) > new Date()) {
                    acc.active.push(item);
                }
                else if (!!item.currentBid) {
                    acc.confirmation.push(item);
                }
            }
            else {
                acc.completed.push(item)
            }
            return acc;
        }, { confirmation: [], drafts: [], active: [], completed: [] });
    }, [auctions]);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    if (auctionsLoading) {
        return (
            <div className="profile-page-content">
                <div className="profile-auctions-container">
                    <div className="loading-layout" style={{height: '130px'}}/>
                    <div className="loading-layout" style={{height: '130px'}}/>
                    <div className="loading-layout" style={{height: '130px'}}/>
                </div>
            </div>
        );
    }

    if (errorCode) {
        return (
            <div className="profile-page-content">
                <div className="profile-auctions-container">
                    Error.
                </div>
            </div>
        );
    }

    const handleChange = (event) => {
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked,
        });
    };

    const isOwner = !userName || userName.toLowerCase() === user.userName.toLowerCase();

    return (
        <div className="profile-page-content">
            <div className="profile-auctions-container">
                {isOwner && <Link to="/auctions/new"><Button variant="contained" color="success" fullWidth>New</Button></Link>}
                {isOwner && <AuctionStatusFilter drafts={checkedItems.drafts} active={checkedItems.active} completed={checkedItems.completed} onChange={handleChange}/>}
                {!auctions.length && 'Nothing found'}
                {!!splittedAuctions.confirmation.length && <div className="auction-separator active">Waiting for confirmation</div>}
                {splittedAuctions.confirmation.map(
                    (auction) => (
                        <AuctionCard key={auction.id} auction={auction}>
                            <ConfirmButton auctionId={auction.id} />
                        </AuctionCard>
                    )
                )}
                {checkedItems.drafts && !!splittedAuctions.drafts.length && <div className="auction-separator">Drafts</div>}
                {checkedItems.drafts && splittedAuctions.drafts.map(
                    (auction) => (
                        <AuctionCard key={auction.id} auction={auction}>
                            <Link to={`/auctions/${auction.id}/edit`}><Button variant="contained">Edit</Button></Link>
                            <LaunchAuctionButton auctionId={auction.id} />
                        </AuctionCard>
                    )
                )}
                {checkedItems.active && !!splittedAuctions.active.length && <div className="auction-separator active">Active auctions</div>}
                {checkedItems.active && splittedAuctions.active.map(
                    (auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    )
                )}
                {checkedItems.completed && !!splittedAuctions.completed.length && <div className="auction-separator">Completed auctions</div>}
                {checkedItems.completed && splittedAuctions.completed.map(
                    (auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    )
                )}
            </div>
        </div>
    );
}

const AuctionStatusFilter = ({drafts, active, completed, onChange}) => {
    return (
        <div className="auction-type-filter-bar">
            <div className="auction-type-filter-item">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={drafts}
                            onChange={onChange}
                            name="drafts"
                        />
                    }
                    label="Drafts"
                />
            </div>
            <div className="auction-type-filter-item">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={active}
                            onChange={onChange}
                            name="active"
                        />
                    }
                    label="Active"
                />
            </div>
            <div className="auction-type-filter-item">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={completed}
                            onChange={onChange}
                            name="completed"
                        />
                    }
                    label="Completed"
                />
            </div>
        </div>
    )
}

const ConfirmButton = ({auctionId}) => {
    const {addError} = useContext(ErrorContext);

    const handleClick = useCallback(async (e) => {
        const response = await fetch(`/api/auctions/${auctionId}/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        if (!response.ok) {
            addError(new ErrorCode( await response.text()));
        }
    }, []);

    return (<Button variant="contained" color="success" onClick={handleClick}>Confirm</Button>);
};

const LaunchAuctionButton = ({auctionId}) => {
    const navigate = useNavigate();

    const {addError} = useContext(ErrorContext);

    const [isOpen, setIsOpen] = useState(false);
    const [timeInterval, setTimeInterval] = useState({
        amount: 1,
        unit: 'hours',
    });

    const handleOpen = useCallback(e => setIsOpen(true), []);
    const handleClose = useCallback(e => setIsOpen(false), []);

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setTimeInterval({
            ...timeInterval,
            [name]: value,
        });
    }, [timeInterval]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const { amount, unit } = timeInterval;
        let timeSpanString = '';

        const amountInt = parseInt(amount, 10);

        switch (unit) {
            case 'minutes':
                timeSpanString = `00:${amountInt.toString().padStart(2, '0')}:00`;
                break;
            case 'hours':
                timeSpanString = `${amountInt.toString().padStart(2, '0')}:00:00`;
                break;
            case 'days':
                timeSpanString = `${amountInt}.00:00:00`;
                break;
            default:
                throw new Error("Invalid unit");
        }

        const response = await fetch(`/api/auctions/${auctionId}/launch`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                period: timeSpanString
            })
        });

        if (!response.ok) {
            addError(new ErrorCode( await response.text()));
        }
        else {
            navigate(`/auctions/${auctionId}`)
        }
    }, []);

    return (
        <>
            <Button variant="contained" color="success" onClick={handleOpen}>Launch</Button>
            <Modal
                open={isOpen}
                onClose={handleClose}
            >
                <div className="default-modal-container">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Количество"
                            name="amount"
                            type="number"
                            value={timeInterval.amount}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Select
                            name="unit"
                            value={timeInterval.unit}
                            onChange={handleChange}
                            label="Unit"
                            fullWidth
                        >
                            <MenuItem value="minutes">Minutes</MenuItem>
                            <MenuItem value="hours">Hours</MenuItem>
                            <MenuItem value="days">Days</MenuItem>
                        </Select>
                        <Button type="submit" variant="contained" fullWidth>
                            Confirm
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default UserAuctions;