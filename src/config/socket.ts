import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

// Connect to the backend HTTP server stream
export const socket = io(BACKEND_URL, {
    autoConnect: true,
    transports: ['websocket']
});