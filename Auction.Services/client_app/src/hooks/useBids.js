import {useCallback, useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useBids = (id, enabled = true) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined);
    
    const reload = useCallback(async () => {
        setLoading(true);

        const response = await fetch(`/api/auctions/${id}/bids`);

        if (response.ok) {
            setBids(await response.json());
        }
        else {
            setErrorCode(new ErrorCode(await response.text()));
        }

        setLoading(false);
    }, [id]);

    useEffect(() => {
        if (enabled) {
            reload();
        }
    }, [id, enabled]);

    return [bids, loading, errorCode, reload];
}

export default useBids;