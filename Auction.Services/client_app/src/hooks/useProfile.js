import {useCallback, useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useProfile = (userName = null, enabled) => {
    const [profile, setProfile] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined)

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            
            const response = userName ? await fetch(`/api/profiles/${userName}`) : await fetch('/api/profiles');

            if (response.ok) {
                setProfile(await response.json());
            }
            else {
                setErrorCode(new ErrorCode(await response.text()));
            }
            
            setLoading(false);
        };

        if (enabled) {
            fetchProfile();
        }
    }, [userName, enabled]);

    return [profile, loading, errorCode];
}

export default useProfile;