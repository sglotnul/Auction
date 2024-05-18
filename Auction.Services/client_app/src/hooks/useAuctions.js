import {useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useAuctions = (filter, enabled = true) => {
    const [auctions, setAuctions] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoading(true)
            
            const uri = new URL('/api/auctions', window.location.href);
            uri.search = filter.getQueryString();
            
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error(new ErrorCode(await response.text()).message());
            }

            const data = await response.json();
            
            setAuctions(data.auctions);
            setCount(data.count);
            setLoading(false);
        };

        if (enabled) {
            fetchAuctions();
        }
    }, [filter, enabled]);
    
    return [auctions, count, loading];
}

export default useAuctions;