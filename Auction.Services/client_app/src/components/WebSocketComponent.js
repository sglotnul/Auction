import React, {useState, useEffect} from 'react';
import {useWebSocket} from "../hooks/useWebSocket";

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const socket = useWebSocket('ws://localhost:5011/ws');

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                console.log('Received message:', event.data);
                setMessages(prev => [...prev, event.data]); // Добавляем сообщение в массив
            };
        }
    }, [socket]);

    return (
        <div>
            <h1>WebSocket Data</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketComponent;
