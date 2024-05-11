import {useEffect, useState} from 'react';

const useAuctions = (filter) => {
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
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            setAuctions(data.auctions);
            setCount(data.count);
            setLoading(false);
        };

        fetchAuctions();
    }, [filter]);
    
    return [auctions, count, loading];
}

export default useAuctions;