const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  // console.log(`User ${socket.id} connected`);

  socket.on('join-room', (data) => {
    socket.join(data.roomId);
    // console.log(`User ${data.username} with ID: ${socket.id} joined the room: ${data.roomId}`);
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
    // console.log(`User with ID: ${socket.id} send message: ${data.message}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    // console.log(`User ${socket.id} leave the room ${roomId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`User with ID: ${socket.id} disconnected due to ${reason}`);
  });
});

server.listen( 3001, () => {
  console.log('Chat server started');
});
