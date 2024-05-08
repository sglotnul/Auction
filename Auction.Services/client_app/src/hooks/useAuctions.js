import {useEffect, useState} from 'react';

const useAuctions = (filter) => {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const fetchAuctions = async () => {
            const response = await fetch('api/auctions');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setAuctions(await response.json());
        };

        fetchAuctions();
    }, [filter]);
    
    return auctions;
}

export default useAuctions;