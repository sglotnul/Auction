import {useCallback, useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useAuction = (id, enabled = true) => {
    const [auction, setAuction] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoading(true)

            const response = await fetch(`/api/auctions/${id}`);

            setStatus(response.status);
            if (response.ok) {
                setAuction(await response.json());
            }
            setLoading(false);
        };

        if (enabled) {
            fetchAuctions();
        }
    }, [id, enabled]);
    
    const updateAuction = useCallback(async (auction) => {
        const response = await fetch(`/api/auctions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(auction)
        });

        if (response.ok) {
            setAuction(await response.json());
        }

        return response.ok ? null : new ErrorCode(await response.text());
    }, []);

    return [auction, loading, status, updateAuction];
}

export default useAuction;