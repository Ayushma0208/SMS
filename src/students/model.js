import db from '../config/db.js';

// Check if user exists by email
export const isUserExist = async (email) => {
    const query = 'SELECT * FROM tbl_students WHERE email = $1';
    const values = [email];
    return db.query(query, values);
};

// Create a new user (insert into table)
export const createUser = async (data) => {
    const { fullname, address, dob, gender, phoneNumber, email, password } = data;
    const query = `
        INSERT INTO tbl_students (fullname, address, dob, gender, phoneNumber, email, password)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
    const values = [fullname, address, dob, gender, phoneNumber, email, password];
    return db.query(query, values);
};

// Update student by ID
export const updateStudent = async (fullName, address, dob, gender, phoneNumber, profile_image, id) => {
  const query = `
    UPDATE tbl_students 
    SET fullName = $1, address = $2, dob = $3, gender = $4, phoneNumber = $5, profile_image = $6, updated_at = NOW()
    WHERE id = $7 RETURNING *`;
    
  const values = [fullName, address, dob, gender, phoneNumber, profile_image, id];
  
  return db.query(query, values);
};

export const studentDelete = async (id) => {
  const query = `DELETE FROM tbl_students WHERE id = $1`;
  const values = [id];
  return db.query(query, values); 
};

export const getAllStudents = async() =>{
  return db.query(`SELECT * FROM tbl_students`)
}

export const getstudentByIdModel = async (id) => {
  const result = await db.query(`SELECT * FROM tbl_students WHERE id = $1`, [id]);
  return result.rows[0];
};

export const StudentclassAssign = async (id, class_id) => {
  const query = `UPDATE tbl_students SET class_id = $1 WHERE id = $2 RETURNING *`;
  const values = [class_id, id]; 
  return db.query(query, values);
};

export const getGradesfromId = async(grade_id) =>{
  const result = await db.query(`SELECT * FROM tbl_grades WHERE grade_id = $1`, [grade_id]);
  return result.rows[0];
}