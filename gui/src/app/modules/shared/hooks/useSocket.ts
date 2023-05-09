import io from 'socket.io-client';

const useSocket = () => {
  const socket = io('192.168.18.68:5000', {
    transports: ["websocket"],
  });

  console.log('[IO] Connection => Attempting Connection');

  socket.on('connect', () => {
    console.log('[IO] Connect => Connection established');
  });

  return socket;
}

export { useSocket }
