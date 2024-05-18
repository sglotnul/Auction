import {useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            
            const response = await fetch('/api/categories');
            if (response.ok) {
                setCategories(await response.json());
            }
            else {
                setErrorCode(new ErrorCode(await response.text()));
            }
            
            setLoading(false);
        };

        fetchCategories();
    }, []);

    return [categories, loading, errorCode];
}

export default useCategories;