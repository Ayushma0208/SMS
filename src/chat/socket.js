import { saveMessage, fetchMessages } from '../chat/chatModel.js';

const connectedUsers = {}; 

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

   socket.on('register', (userId) => {
  if (typeof userId === 'object' && userId.userId) {
    userId = userId.userId;
  }

  connectedUsers[userId] = socket.id;
  console.log(`✅ User ${userId} registered with socket ID ${socket.id}`);
  console.log('👥 Current connected users:', connectedUsers);

});

    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
      if (!senderId || !receiverId || !message) {
        return socket.emit('error', { message: 'Missing senderId, receiverId, or message' });
      }
      console.log('🔍 Looking for receiverId:', receiverId);

      try {
        const messageId = await saveMessage(senderId, receiverId, message);

        const msg = {
          id: messageId,
          senderId,
          receiverId,
          message,
          createdAt: new Date(),
        };

        console.log(`📤 Message from ${senderId} to ${receiverId}`);

        socket.emit('newMessage', msg);

        const receiverSocketId = connectedUsers[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', msg);
          console.log(`📨 Delivered message to user ${receiverId}`);
        } else {
          console.log(`⚠️ Receiver ${receiverId} not connected`);
        }
      } catch (err) {
        console.error('❌ Error sending message:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('getMessages', async ({ user1, user2 }) => {
      if (!user1 || !user2) {
        return socket.emit('error', { message: 'Missing user1 or user2' });
      }

      try {
        const messages = await fetchMessages(user1, user2);
        socket.emit('messages', messages);
      } catch (err) {
        console.error('❌ Error fetching messages:', err);
        socket.emit('error', { message: 'Failed to fetch messages' });
      }
    });

    // ✅ Handle disconnection
    socket.on('disconnect', () => {
      console.log('❎ Client disconnected:', socket.id);
      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          console.log(`🗑️ Removed user ${userId} from connected users`);
          break;
        }
      }
    });
  });
};
