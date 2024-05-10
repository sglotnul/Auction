import {useEffect, useRef} from 'react';

export const useWebSocket = (url) => {
    const socket = useRef(createWS(url));

    useEffect(() => {
        return () => {
            socket.current.close();
        };
    }, [url]);

    return socket.current;
};

function createWS(url){
    const ws = new WebSocket(url);

    ws.onopen = () => {
        console.log("Connected to WebSocket");
        ws.send("Hello Server!");
    };

    ws.onmessage = (event) => {
        console.log("Message from server: ", event.data);
    };

    ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
    };

    return ws;
}
