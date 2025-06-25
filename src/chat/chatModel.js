import db from '../config/db.js';

export const saveMessage = async (senderId, receiverId, message) => {
  const result = await db.query(
    `INSERT INTO tbl_messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *`,
    [senderId, receiverId, message]
  );
  return result.rows[0]; // full inserted message
};

export const fetchMessages = async (user1, user2) => {
  const result = await db.query(
    `SELECT * FROM tbl_messages 
     WHERE (sender_id = $1 AND receiver_id = $2) 
        OR (sender_id = $2 AND receiver_id = $1) 
     ORDER BY created_at ASC`,
    [user1, user2]
  );
  return result.rows;
};

export const inboxModel = async(userId) =>{
  const [rows] = await db.query (
    `SELECT 
    u.name as sender_name,
    m.message,
    m.createdAt
    FROM tbl_message m
    JOIN tbl_user u ON m.sender_id = u.id
    WHERE m.receiver_id = ? 
    ORDER BY m.createdAt DESC `,
    [userId]
  );
  return rows;
}

// export const saveMessageQuery = (senderId, receiverId, message) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       INSERT INTO tbl_message (sender_id, receiver_id, message, created_at)
//       VALUES (?, ?, ?, NOW())
//     `;
//     db.query(sql, [senderId, receiverId, message], (err, result) => {
//       if (err) {
//         console.error('Error saving message:', err);
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// };

// // Fetch messages between two users
// export const fetchMessagesQuery = (userId1, userId2) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT * FROM tbl_message
//       WHERE (sender_id = ? AND receiver_id = ?)
//          OR (sender_id = ? AND receiver_id = ?)
//       ORDER BY created_at ASC
//     `;
//     db.query(sql, [userId1, userId2, userId2, userId1], (err, result) => {
//       if (err) {
//         console.error('Error fetching messages:', err);
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// };

// // Create chat record (optional if you want to store chat heads)
// export const createChatQuery = (userId1, userId2) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       INSERT INTO chat (user1_id, user2_id, created_at)
//       VALUES (?, ?, NOW())
//     `;
//     db.query(sql, [userId1, userId2], (err, result) => {
//       if (err) {
//         console.error('Error creating chat:', err);
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// };

// // Get all chat partners for a user
// export const getUserChatsQuery = (userId) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT *
//       FROM chat
//       WHERE user1_id = ? OR user2_id = ?
//     `;
//     db.query(sql, [userId, userId], (err, result) => {
//       if (err) {
//         console.error('Error fetching user chats:', err);
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// };


// //Get the chat list of the user
// export const getSendersList = async (userId) => {
//   const query = `
//     SELECT 
//       m.sender_id AS senderId,
//       u.username,
//       u.profile_image,
//       MAX(m.createdAt) AS lastMessageTime
//     FROM tbl_message m
//     JOIN tbl_user u ON m.sender_id = u.id
//     WHERE m.receiver_id = ?
//     GROUP BY m.sender_id
//     ORDER BY lastMessageTime DESC
//   `;
//   const rows = await db.query(query, [userId]);
//   return rows;
// };

