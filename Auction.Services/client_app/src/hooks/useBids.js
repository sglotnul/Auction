import {useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useBids = (id, enabled = true) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined);

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoading(true)

            const response = await fetch(`/api/auctions/${id}/bids`);
            
            if (response.ok) {
                setBids(await response.json());
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

    return [bids, loading, errorCode];
}

export default useBids;