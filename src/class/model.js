import db from '../config/db.js';

export const insertClass = async (classname) => {
  return db.query(
    `INSERT INTO tbl_class (classname, createdat, updatedat)
     VALUES ($1, NOW(), NOW()) RETURNING *`,
    [classname]
  );
};

export const AssignTecherToClass = async(teacher_id,class_id) =>{
  return db.query(
    `INSERT INTO tbl_class_assign (teacher_id,class_id) VALUES ($1,$2)
    RETURNING *;`,
    [teacher_id,class_id]
  )
}