import React, {useContext, useEffect, useState} from "react";
import ErrorContext from "../contexts/ErrorContext";
import useProfile from "../hooks/useProfile";
import ErrorCode from "../models/ErrorCode";
import {Button, TextField} from "@mui/material";

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

export default UserProfile;