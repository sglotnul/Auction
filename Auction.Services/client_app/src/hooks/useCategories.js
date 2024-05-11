import {useEffect, useState} from 'react';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setCategories(await response.json());
            setLoading(false);
        };

        fetchCategories();
    }, []);

    return [categories, loading];
}

export default useCategories;