import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Button, TextField} from "@mui/material";
import ErrorContext from "../../contexts/ErrorContext";
import AuthContext from "../../contexts/AuthContext";
import useUserAuctions from "../../hooks/useUserAuctions";
import AuctionCard from "../AuctionCard";
import useProfile from "../../hooks/useProfile";
import ErrorCode from "../../models/ErrorCode";

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
            <div className="profile-page">
                ...Loading
            </div>
        );
    }

    if (!user) {
        if (userName) {
            return (
                <div className="profile-page">
                   Nothing found
                </div>
            )
        }

        navigate('/');
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
            <div className="default-container">
                ...Loading
            </div>
        );
    }

    if (errorCode) {
        return (
            <div className="default-container">
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

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    if (auctionsLoading) {
        return (
            <div className="profile-page-content">
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
                        <Link key={auction.id} className="auction-card-outer-link" to={`/auctions/${auction.id}`}>
                            <AuctionCard auction={auction}>
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

export default ProfilePage;