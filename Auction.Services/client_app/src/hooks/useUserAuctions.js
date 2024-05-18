import {useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useUserAuctions = (userName, enabled = true) => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoading(true)
            
            const response = await fetch(`/api/auctions/user/${userName}`);
            if (!response.ok) {
                throw new Error(new ErrorCode(await response.text()).message());
            }

            const data = await response.json();
            
            setAuctions(data.auctions);
            setLoading(false);
        };

        if (enabled) {
            fetchAuctions();
        }
    }, [enabled]);
    
    return [auctions, loading];
}

export default useUserAuctions;