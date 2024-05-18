import {useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useAuction = (id, enabled = true) => {
    const [auction, setAuction] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined);

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoading(true)

            const response = await fetch(`/api/auctions/${id}`);
            
            if (response.ok) {
                setAuction(await response.json());
            }
            else {
                setErrorCode(new ErrorCode(await response.text()));
            }
            
            setLoading(false);
        };

        if (enabled) {
            fetchAuctions();
        }
    }, [id, enabled]);

    return [auction, loading, errorCode];
}

export default useAuction;