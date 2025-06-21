import db from '../config/db.js';

export const markAttendance = async (student_id, class_id, date, status) => {
  const query = `
    INSERT INTO tbl_attendance (student_id, class_id, date, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [student_id, class_id, date, status];
  return db.query(query, values);
};