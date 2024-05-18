import {useEffect, useState} from 'react';
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

    return [auction, loading, status];
}

export default useAuction;