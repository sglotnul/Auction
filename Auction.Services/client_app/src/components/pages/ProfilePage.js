import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Button, Checkbox, FormControlLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import ErrorContext from "../../contexts/ErrorContext";
import AuthContext from "../../contexts/AuthContext";
import useUserAuctions from "../../hooks/useUserAuctions";
import AuctionCard from "../AuctionCard";
import useProfile from "../../hooks/useProfile";
import ErrorCode from "../../models/ErrorCode";;

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
                <div className="loading-layout" style={{height: '60px'}}/>
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
    const [edit, setEdit] = useState(false);

    useEffect(() => setProfile(initialProfile), [initialProfile]);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    if (!!profile !== !!initialProfile || loading) {
        return (
            <div className="profile-page-content">
                <div className="profile-data-container">
                    <div className="loading-layout" style={{height: '180px', width: '180px', margin: '0 auto'}}/>
                    <div className="loading-layout" style={{height: '60px'}}/>
                    <div className="loading-layout" style={{height: '60px'}}/>
                </div>
            </div>
        );
    }

    if (errorCode) {
        return (
            <div className="profile-page-content">
                <div className="profile-data-container">
                    Error.
                </div>
            </div>
        );
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (edit) {
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
        }

        setEdit(prev => !prev);
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
            <span className="profile-icon" style={{width: '180px', height: '180px', backgroundPosition: '-180px 0'}} />
            <form className="profile-data-container" onSubmit={handleSubmit}>
                <div className="profile-data-container">
                    <ProfileField
                        editable={edit}
                        label="First name"
                        name="firstName"
                        value={profile?.firstName}
                        onChange={handleProfileInputChange}
                        disabled={!canEdit}
                        fullWidth
                    />
                    <ProfileField
                        editable={edit}
                        label="Last name"
                        name="lastName"
                        value={profile?.lastName}
                        onChange={handleProfileInputChange}
                        disabled={!canEdit}
                        fullWidth
                    />
                    <ProfileField
                        editable={edit}
                        label="Birth date"
                        name="birthDate"
                        type="date"
                        value={formatDate(profile?.birthDate)}
                        onChange={handleProfileInputChange}
                        disabled={!canEdit}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    <ProfileField
                        editable={edit}
                        label="Education"
                        name="education"
                        value={profile?.education}
                        onChange={handleProfileInputChange}
                        fullWidth
                        disabled={!canEdit}
                    />
                    <ProfileField
                        editable={edit}
                        label="Biography"
                        name="biography"
                        multiline
                        value={profile?.biography}
                        onChange={handleProfileInputChange}
                        fullWidth
                        disabled={!canEdit}
                    />
                </div>
                {
                    canEdit && (
                        <Button type="submit" variant="contained" fullWidth>
                            { edit ? 'Confirm' : 'Edit'}
                        </Button>
                    )
                }
            </form>
        </div>
    );
}

const ProfileField = ({label, value, editable, ...props}) => {
    if (!editable) {
        return (
            <div className="profile-data-text-field">
                <span className="profile-data-text-label">{label}:</span>
                <span>{value}</span>
            </div>
        );
    }

    return (
        <TextField
            {...props}
            value={value}
            label={label}
        />
    )
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

export default ProfilePage;