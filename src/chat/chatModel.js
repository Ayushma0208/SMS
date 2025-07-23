import db from '../config/db.js';

export const saveMessage = async (senderId, receiverId, message) => {
  const result = await db.query(
    `INSERT INTO tbl_messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *`,
    [senderId, receiverId, message]
  );
  return result.rows[0]; 
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

//tetsing