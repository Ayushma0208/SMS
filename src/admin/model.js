import db from '../config/db.js';

export const isAdminExist = async (email) => {
    const query = 'SELECT * FROM tbl_admin WHERE email = $1';
    const values = [email];
    return db.query(query, values);
};

// Create a new user (insert into table)
export const createUser = async (data) => {
    const { fullName, email, password } = data;
    const query = `
        INSERT INTO tbl_admin (fullName, email, password)
        VALUES ($1, $2, $3)
        RETURNING *`;
    const values = [fullName, email, password];
    return db.query(query, values);
};

export const AdminLogin = async (email) => {
  const query = 'SELECT * FROM tbl_admin WHERE email = $1';
  const values = [email];
  return db.query(query, values);
};