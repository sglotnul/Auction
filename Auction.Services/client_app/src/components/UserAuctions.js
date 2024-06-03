import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import ErrorContext from "../contexts/ErrorContext";
import useUserAuctions from "../hooks/useUserAuctions";
import {Link, useNavigate} from "react-router-dom";
import {Button, Checkbox, FormControlLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import AuctionCard from "./AuctionCard";
import ErrorCode from "../models/ErrorCode";

const UserAuctions = ({user, userName}) => {
    const {addError} = useContext(ErrorContext);

    const [auctions, auctionsLoading, errorCode, reload] = useUserAuctions(userName || user?.userName);

    const [checkedItems, setCheckedItems] = useState({
        drafts: true,
        active: true,
        completed: false,
    });

    const splittedAuctions = useMemo(() => {
        return auctions.reduce((acc, item, index) => {
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
                else {
                    acc.completed.push(item);
                }
            }
            else {
                acc.completed.push(item)
            }
            
            if (index === auctions.length - 1) {
                const sortFunction = (a, b) => b.id - a.id ;
                
                acc.confirmation = acc.confirmation.sort(sortFunction);
                acc.drafts = acc.drafts.sort(sortFunction);
                acc.active = acc.active.sort(sortFunction);
                acc.completed = acc.completed.sort(sortFunction);
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
                    Ошибка.
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

    const isOwner = !userName || userName?.toLowerCase() === user?.userName.toLowerCase();

    return (
        <div className="profile-page-content">
            <div className="profile-auctions-container">
                {isOwner && <Link to="/auctions/new"><Button variant="contained" color="success" fullWidth>Новый лот</Button></Link>}
                {isOwner && <AuctionStatusFilter drafts={checkedItems.drafts} active={checkedItems.active} completed={checkedItems.completed} onChange={handleChange}/>}
                {!auctions.length && 'Ничего не найдено.'}
                {!!splittedAuctions.confirmation.length && <div className="auction-separator active">Ожидающие подтверждения</div>}
                {splittedAuctions.confirmation.map(
                    (auction) => (
                        <AuctionCard key={auction.id} auction={auction}>
                            <div className="auction-card-button-row">
                                <ConfirmButton auctionId={auction.id}/>
                                <CancelButton auctionId={auction.id} onAction={reload} />
                            </div>
                        </AuctionCard>
                    )
                    )}
                {checkedItems.drafts && !!splittedAuctions.drafts.length && <div className="auction-separator">Черновики</div>}
                {checkedItems.drafts && splittedAuctions.drafts.map(
                    (auction) => (
                        <AuctionCard key={auction.id} auction={auction}>
                            <div className="auction-card-button-row">
                                <LaunchAuctionButton auctionId={auction.id} />
                                <Link to={`/auctions/${auction.id}/edit`}><Button variant="contained">Редактировать</Button></Link>
                            </div>
                        </AuctionCard>
                    )
                )}
                {checkedItems.active && !!splittedAuctions.active.length && <div className="auction-separator active">Активные лоты</div>}
                {checkedItems.active && splittedAuctions.active.map(
                    (auction) => (
                        <AuctionCard key={auction.id} auction={auction}>
                            <div className="auction-card-button-row">
                                {isOwner && <CancelButton auctionId={auction.id} onAction={reload}/>}
                            </div>  
                        </AuctionCard>
                    )
                    )}
                {checkedItems.completed && !!splittedAuctions.completed.length && <div className="auction-separator">Завершенные лоты</div>}
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
                    label="Черновики"
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
                    label="Активные"
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
                    label="Завершенные"
                />
            </div>
        </div>
    )
}

const CancelButton = ({auctionId, onAction}) => {
    const {addError} = useContext(ErrorContext);

    const handleClick = useCallback(async (e) => {
        const response = await fetch(`/api/auctions/${auctionId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        if (!response.ok) {
            addError(new ErrorCode( await response.text()));
        }
        else {
            onAction();
        }
    }, []);

    return (<Button variant="contained" color="error" onClick={handleClick}>Отменить</Button>);
};

const ConfirmButton = ({auctionId}) => {
    const navigate = useNavigate();
    
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
        else {
            navigate('/profile?tab=2');
        }
    }, []);

    return (<Button variant="contained" color="success" onClick={handleClick}>Начать консультацию</Button>);
};

const LaunchAuctionButton = ({auctionId}) => {
    const navigate = useNavigate();

    const {addError} = useContext(ErrorContext);

    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState(1);
    const [unit, setUnit] = useState('hours');

    const handleOpen = useCallback(e => setIsOpen(true), []);
    const handleClose = useCallback(e => setIsOpen(false), []);

    const handleAmountChange = useCallback((event) => {
        setAmount(prev => event.target.value >= 1 ? event.target.value : prev);
    }, []);

    const handleUnitChange = useCallback((event) => {
        setUnit(event.target.value);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

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
    }, [amount, unit]);

    return (
        <>
            <Button variant="contained" color="success" onClick={handleOpen}>Запустить</Button>
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
                            value={amount}
                            onChange={handleAmountChange}
                            sx={{marginBottom: '8px'}}
                            fullWidth
                        />
                        <Select
                            name="unit"
                            value={unit}
                            onChange={handleUnitChange}
                            label="Ед.измерения"
                            fullWidth
                            sx={{marginBottom: '8px'}}
                        >
                            <MenuItem value="minutes">Минут</MenuItem>
                            <MenuItem value="hours">Часов</MenuItem>
                            <MenuItem value="days">Дней</MenuItem>
                        </Select>
                        <Button type="submit" variant="contained" fullWidth>
                            Подтвердить
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default UserAuctions;