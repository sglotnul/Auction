import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useWebSocket = (url) => {
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io(url);

        return () => {
            socket.current.disconnect();
        };
    }, [url]);

    return socket.current;
};
