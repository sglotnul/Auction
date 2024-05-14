import {useEffect, useState} from 'react';

const useProfile = (userName = null) => {
    const [auction, setAuction] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            
            const response = await fetch(`/api/profiles/${userName}`);

            setStatus(response.status);
            if (response.ok) {
                setAuction(await response.json());
            }
            setLoading(false);
        };

        fetchProfile();
    }, [userName]);

    return [auction, loading, status];
}

export default useProfile;