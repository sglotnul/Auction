import {useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useUserAuctions = (userName, enabled = true) => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined);

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoading(true)
            
            const response = await fetch(`/api/auctions/user/${userName}`);
            if (response.ok) {
                const data = await response.json();

                setAuctions(data.auctions);
            }
            if (!response.ok) {
                setErrorCode(new ErrorCode(await response.text()));
            }

            setLoading(false);
        };

        if (enabled) {
            fetchAuctions();
        }
    }, [enabled]);
    
    return [auctions, loading, errorCode];
}

export default useUserAuctions;