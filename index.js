
import express from 'express';
import dotenv from 'dotenv';
import router from './src/index.js';
import { Pool } from 'pg';
import { Server } from 'socket.io';
import http from 'http';
import {socketHandler } from './src/chat/socket.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, Node.js with ES Modules!');
});

app.use('/api',router)

// Create DB pool
const db = new Pool({ connectionString: process.env.DATABASE_URL });

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ✅ Call socket setup function
socketHandler(io, db);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
