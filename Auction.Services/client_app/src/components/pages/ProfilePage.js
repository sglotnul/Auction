import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Button, Checkbox, FormControlLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import ErrorContext from "../../contexts/ErrorContext";
import AuthContext from "../../contexts/AuthContext";
import useUserAuctions from "../../hooks/useUserAuctions";
import AuctionCard from "../AuctionCard";
import useProfile from "../../hooks/useProfile";
import ErrorCode from "../../models/ErrorCode";
import NumericStepper from "../NumericStepper";

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const {userName} = useParams();
    
    const {user, loading} = useContext(AuthContext);

    const tabParam = searchParams.get('tab');
    const tab = isNaN(tabParam) ? 0 : Number(tabParam);

    if (loading) {
        return (
            <div className="default-container">
                <div className="loading-layout" style={{height: '130px'}}/>
            </div>
        );
    }

    const changeTab = (newTab) => (e) => {
        e.preventDefault();

        searchParams.set('tab', newTab);
        navigate(`?${searchParams.toString()}`, { replace: true })
    };

    return (
        <div className="default-container">
            <div className="tab-bar default-tabs">
                <div className={tab === 0 ? 'tab disabled' : 'tab'} onClick={changeTab(0)}>Profile</div>
                <div className={tab === 1 ? 'tab disabled' : 'tab'} onClick={changeTab(1)}>Auctions</div>
            </div>
            {tab === 0 && <UserProfile user={user} userName={userName} />}
            {tab === 1 && <UserAuctions user={user} userName={userName} />}
        </div>
    )
}

const UserProfile = ({user, userName}) => {
    const { addError } = useContext(ErrorContext);
    
    const [initialProfile, loading, errorCode] = useProfile(userName || user?.userName);

    const [profile, setProfile] = useState(initialProfile);

    useEffect(() => setProfile(initialProfile), [initialProfile]);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    if (!!profile !== !!initialProfile || loading) {
        return (
            <div className="profile-page-content">
                <div className="loading-layout" style={{height: '60px'}}/>
                <div className="loading-layout" style={{height: '60px'}}/>
                <div className="loading-layout" style={{height: '60px'}}/>
            </div>
        );
    }

    if (errorCode) {
        return (
            <div className="profile-page-content">
                Error.
            </div>
        );
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/profiles', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(profile)
        });

        if (response.ok) {
            setProfile(await response.json());
        }
        else {
            addError(new ErrorCode(await response.text()));
        }
    };

    const handleProfileInputChange = (event) => {
        let prevData = profile;
        if (!prevData) {
            prevData = {};
        }

        setProfile({ ...prevData, [event.target.name]: event.target.value || null });
    }

    function formatDate(dateString) {
        if (!dateString)
            return '';

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const canEdit = !userName || userName.toLowerCase() === user?.userName.toLowerCase();

    return (
        <div className="profile-page-content">
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First name"
                    name="firstName"
                    value={profile?.firstName}
                    onChange={handleProfileInputChange}
                    disabled={!canEdit}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Last name"
                    name="lastName"
                    value={profile?.lastName}
                    onChange={handleProfileInputChange}
                    disabled={!canEdit}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label="Birth date"
                    name="birthDate"
                    type="date"
                    value={formatDate(profile?.birthDate)}
                    onChange={handleProfileInputChange}
                    margin="normal"
                    disabled={!canEdit}
                />
                <TextField
                    label="Education"
                    name="education"
                    value={profile?.education}
                    onChange={handleProfileInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!canEdit}
                />
                <TextField
                    label="Biography"
                    name="biography"
                    multiline
                    rows={4}
                    value={profile?.biography}
                    onChange={handleProfileInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!canEdit}
                />
                {
                    canEdit && (
                        <Button type="submit" variant="contained" fullWidth>
                            Confirm
                        </Button>
                    )
                }
            </form>
        </div>
    );
}

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
            if (!item.startAt) {
                acc.drafts.push(item);
            }
            else if (new Date(item.endAt) > new Date()) {
                acc.active.push(item);
            } else {
                acc.completed.push(item);
            }
            return acc;
        }, { drafts: [], active: [], completed: [] });
    }, [auctions]);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    if (auctionsLoading) {
        return (
            <div className="profile-page-content">
                <div className="loading-layout" style={{height: '130px'}}/>
                <div className="loading-layout" style={{height: '130px'}}/>
                <div className="loading-layout" style={{height: '130px'}}/>
            </div>
        );
    }

    if (errorCode) {
        return (
            <div className="profile-page-content">
                Error.
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
            {isOwner && <AuctionStatusFilter drafts={checkedItems.drafts} active={checkedItems.active} completed={checkedItems.completed} onChange={handleChange}/>}
            {!auctions.length && 'Nothing found'}
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

export default ProfilePage;