import {useCallback, useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useUserAuctions = (userName, enabled = true) => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined);
    
    const reload = useCallback(async () => {
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
    }, [userName]);

    useEffect(() => {
        if (enabled) {
            reload();
        }
    }, [userName, enabled]);
    
    return [auctions, loading, errorCode, reload];
}

export default useUserAuctions;