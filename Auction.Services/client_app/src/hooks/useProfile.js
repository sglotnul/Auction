import {useCallback, useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useProfile = (userName = null, state) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            
            const response = userName ? await fetch(`/api/profiles/${userName}`) : await fetch('/api/profiles');

            if (response.ok) {
                setProfile(await response.json());
            }
            setLoading(false);
        };

        fetchProfile();
    }, [userName, state]);
    
    const updateProfile = useCallback(async (profile) => {
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
        
        return response.ok ? null : new ErrorCode(await response.text());
    }, []);

    return [profile, loading, updateProfile];
}

export default useProfile;