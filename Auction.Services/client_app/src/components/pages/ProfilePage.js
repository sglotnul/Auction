import {Button, TextField} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import useProfile from "../../hooks/useProfile";
import AuthContext from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import ErrorContext from "../../contexts/ErrorContext";

const ProfilePage = () => {
    const navigate = useNavigate();

    const { addError } = useContext(ErrorContext);
    const { user, loading: userLoading } = useContext(AuthContext);
    
    const [initialProfile, loading, updateProfile] = useProfile();
    
    const [profile, setProfile] = useState(initialProfile);
    
    useEffect(() => setProfile(initialProfile), [initialProfile]);

    if (loading || userLoading) {
        return (
            <div className="default-form-container">
                ...Loading
            </div>
        );
    }
    
    if (!user) {
        navigate('/');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const error = await updateProfile(profile);

        if (error) {
            addError(error);
        }
    };

    const handleProfileInputChange = (event) => {
        let prevData = profile;
        if (!prevData) {
            prevData = {};
        }

        setProfile({ ...prevData, [event.target.name]: event.target.value.trim() || null });
    }
    
    return (
        <div className="default-form-container">
            <form onSubmit={handleSubmit}>
                <TextField
                    InputLabelProps={{ shrink: !!initialProfile }}
                    label="First name"
                    name="firstName"
                    value={profile?.firstName}
                    onChange={handleProfileInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    InputLabelProps={{ shrink: !!initialProfile }}
                    label="Last name"
                    name="lastName"
                    value={profile?.lastName}
                    onChange={handleProfileInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    InputLabelProps={{ shrink: !!initialProfile }}
                    label="Birth date"
                    name="birthDate"
                    type="date"
                    value={formatDate(profile?.birthDate)}
                    onChange={handleProfileInputChange}
                    margin="normal"
                />
                <TextField
                    InputLabelProps={{ shrink: !!initialProfile }}
                    label="Education"
                    name="education"
                    value={profile?.education}
                    onChange={handleProfileInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    InputLabelProps={{ shrink: !!initialProfile }}
                    label="Biography"
                    name="biography"
                    multiline
                    rows={4}
                    value={profile?.biography}
                    onChange={handleProfileInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" fullWidth>
                    Confirm
                </Button>
            </form>
        </div>
    );
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

export default ProfilePage;