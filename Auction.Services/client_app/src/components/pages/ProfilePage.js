import DefaultPageLayout from "../DefaultPageLayout";
import {Button, TextField} from "@mui/material";
import React, {useContext, useState} from "react";
import useProfile from "../../hooks/useProfile";
import AuthContext from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";

const ProfilePage = () => {
    const navigate = useNavigate();
    
    const { user, loading: userLoading } = useContext(AuthContext);
    
    const [initialProfile, loading, updateProfile] = useProfile();
    
    const [profile, setProfile] = useState(initialProfile);
    const [errorCode, setErrorCode] = useState(undefined);

    if (loading || userLoading) {
        return (
            <DefaultPageLayout>
                <div className="default-form-container">
                    ...Loading
                </div>
            </DefaultPageLayout>
        );
    }
    
    if (!user) {
        navigate('/');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const error = updateProfile(profile);

        if (error) {
            setErrorCode(error);
        }
        else {
            setErrorCode(undefined);
        }
    };

    const handleProfileInputChange = (event) => {
        let prevData = profile;
        if (!prevData) {
            prevData = {};
        }

        setProfile({ ...prevData, [event.target.name]: event.target.value.trim() });
    }
    
    return (
        <DefaultPageLayout errorCode={errorCode}>
            <div className="default-form-container">
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="First name"
                        name="firstName"
                        value={profile?.firstName}
                        onChange={handleProfileInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last name"
                        name="lastName"
                        value={profile?.lastName}
                        onChange={handleProfileInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        label="Birth date"
                        name="birthDate"
                        type="date"
                        value={profile?.birthDate}
                        onChange={handleProfileInputChange}
                        margin="normal"
                    />
                    <TextField
                        label="Education"
                        name="education"
                        value={profile?.education}
                        onChange={handleProfileInputChange}
                        fullWidth
                        margin="normal"
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
                    />
                    <Button type="submit" variant="contained" fullWidth>
                        Confirm
                    </Button>
                </form>
            </div>
        </DefaultPageLayout>
    );
}

export default ProfilePage;