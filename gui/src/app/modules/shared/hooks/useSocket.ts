import { useMemo } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const socket = io('localhost:5000', {
    transports: ["websocket"],
  });

  console.log('[IO] Connection => Attempting Connection');

  socket.on('connect', () => {
    console.log('[IO] Connect => Connection established');
  });

  return socket;
}

export { useSocket }
