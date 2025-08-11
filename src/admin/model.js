import db from '../config/db.js';

export const isAdminExist = async (email) => {
    const query = 'SELECT * FROM tbl_admin WHERE email = $1';
    const values = [email];
    return db.query(query, values);
};

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

export const getAdminById = async (adminId) => {
  const [rows] = await db.execute("SELECT password FROM tbl_admin WHERE id = ?", [adminId]);
  return rows[0];
};

export const updateAdminPassword = async (adminId, hashedPassword) => {
  await db.execute("UPDATE tbl_admin SET password = ? WHERE id = ?", [hashedPassword, adminId]);
};

export const findAdminById = async (adminId) => {
  const query = `SELECT id, name, email, role, created_at 
                 FROM tbl_admin 
                 WHERE id = $1`;
  const values = [adminId];
  
  const { rows } = await pool.query(query, values);
  return rows[0]; // Return single admin
};
