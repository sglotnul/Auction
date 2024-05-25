import {useEffect, useState} from 'react';
import ErrorCode from "../models/ErrorCode";

const useUser = (userName, enabled = true) => {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(undefined);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)

            const response = await fetch(`/api/user/${userName}`);
            
            if (response.ok) {
                setUser(await response.json());
            }
            else {
                setErrorCode(new ErrorCode(await response.text()));
            }
            
            setLoading(false);
        };

        if (enabled) {
            fetchUser();
        }
    }, [userName, enabled]);

    return [user, loading, errorCode];
}

export default useUser;