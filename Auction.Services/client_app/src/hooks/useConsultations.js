import {useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useConsultations = (enabled = true) => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined);

    useEffect(() => {
        const fetchConsultations = async () => {
            setLoading(true)
            
            const response = await fetch('/api/consultations');
            if (response.ok) {
                const data = await response.json();

                setConsultations(data.consultations);
            }
            else {
                setErrorCode(new ErrorCode(await response.text()));
            }
            
            setLoading(false);
        };

        if (enabled) {
            fetchConsultations();
        }
    }, [enabled]);
    
    return [consultations, loading, errorCode];
}

export default useConsultations;