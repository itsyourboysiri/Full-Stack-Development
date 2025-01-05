import WebSocket from 'ws';
const jwt = require('jsonwebtoken'); // For token validation (if needed)

const wss = new WebSocket.Server({ port: 5000 });
const clients = new Map(); // Map to associate users with WebSocket connections

wss.on('connection', (socket, req) => {
  console.log('New client connected.');

  // Example: Authenticate using a token from the query string
  const token = req.url ? new URL(req.url, `http://${req.headers.host}`).searchParams.get('token') : null;
  let userId = null;

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Replace with your JWT secret
    userId = decoded.id; // Extract user ID from the token
    clients.set(userId, socket); // Map the user to the WebSocket connection
  } catch (err) {
    console.error('Invalid token:', err);
    socket.close();
    return;
  }

  socket.on('message', (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'update-booking') {
      const { bookingId, seats } = data.payload;
      // Update the booking in the database (example logic)
      console.log(`User ${userId} updated booking ${bookingId}:`, seats);

      // Broadcast update to all clients
      broadcast({ type: 'booking-updated', payload: { bookingId, seats } });
    } else if (data.type === 'remove-booking') {
      const { bookingId } = data.payload;
      // Remove the booking in the database (example logic)
      console.log(`User ${userId} removed booking ${bookingId}`);

      // Broadcast removal to all clients
      broadcast({ type: 'booking-removed', payload: { bookingId } });
    }
  });

  socket.on('close', () => {
    console.log(`User ${userId} disconnected.`);
    clients.delete(userId);
  });
});

// Broadcast a message to all connected clients
function broadcast(message: { type: string; payload: any }) {
  const msg = JSON.stringify(message);
  clients.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
    }
  });
}

console.log('WebSocket server running on ws://localhost:5000');
