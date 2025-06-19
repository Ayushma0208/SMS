import db from '../config/db.js';

export const isTeacherExist = async(email) =>{
    const query = `SELECT * FROM tbl_teachers WHERE email = $1`;
    const value = [email];
    return db.query(query,value);
}

export const createTeacher = async(data) =>{
    const {fullName,email,password,phone,address,subject,qualification,experience,date_of_birth} = data ;
    const query = `INSERT  INTO tbl_teachers  
    (fullName, email, password, phone, address, subject, qualification, experience, date_of_birth)
     VALUES 
     ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`;
    const value = [fullName,email,password,phone,address,subject,qualification,experience,date_of_birth];
    return db.query(query,value);
}

export const teacherLogin = async (email) => {
  const query = 'SELECT * FROM tbl_teachers WHERE email = $1';
  const values = [email];
  return db.query(query, values);
};

export const  teacherUpdate = async(id,fullname,phone,address,subject,qualification,experience,date_of_birth) =>{
    return db.query(
    `UPDATE tbl_teachers
     SET "fullname" = $1, phone = $2, address = $3,
         subject = $4, qualification = $5, experience = $6, date_of_birth = $7
     WHERE id = $8`,
    [fullname, phone, address, subject, qualification, experience, date_of_birth, id]
  );
}

export const teacherDelete = async (id) => {
  const query = `DELETE FROM tbl_teachers WHERE id = $1`;
  const values = [id];
  return db.query(query, values); 
};

export const getAllTeacher = async() =>{
  return db.query(`SELECT * FROM tbl_teachers`)
}