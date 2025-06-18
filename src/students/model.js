import db from '../config/db.js';

// Check if user exists by email
export const isUserExist = async (email) => {
    const query = 'SELECT * FROM tbl_students WHERE email = $1';
    const values = [email];
    return db.query(query, values);
};

// Create a new user (insert into table)
export const createUser = async (data) => {
    const { fullName, address, dob, gender, phoneNumber, email, password } = data;
    const query = `
        INSERT INTO tbl_students (fullName, address, dob, gender, phoneNumber, email, password)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
    const values = [fullName, address, dob, gender, phoneNumber, email, password];
    return db.query(query, values);
};

// Update student by ID
export const updateStudent = async (fullName, address, dob, gender, phoneNumber, id) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (fullName !== undefined) {
    fields.push(`fullName = $${index++}`);
    values.push(fullName);
  }
  if (address !== undefined) {
    fields.push(`address = $${index++}`);
    values.push(address);
  }
  if (dob !== undefined) {
    fields.push(`dob = $${index++}`);
    values.push(dob);
  }
  if (gender !== undefined) {
    fields.push(`gender = $${index++}`);
    values.push(gender);
  }
  if (phoneNumber !== undefined) {
    fields.push(`phoneNumber = $${index++}`);
    values.push(phoneNumber);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const query = `
    UPDATE tbl_students 
    SET ${fields.join(', ')} 
    WHERE id = $${index}
    RETURNING *;
  `;

  return db.query(query, values);
};

export const studentDelete = async (id) => {
  const query = `DELETE FROM tbl_students WHERE id = $1`;
  const values = [id];
  return db.query(query, values); 
};
