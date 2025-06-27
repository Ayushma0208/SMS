import db from '../config/db.js';

export const checkExistingGrade = async (student_id, teacher_id, subject) => {
  return db.query(
    `SELECT * FROM tbl_grades WHERE student_id=$1 AND teacher_id=$2 AND subject=$3`,
    [student_id, teacher_id, subject]
  );
};

export const giveGrades = async(student_id,teacher_id,subject, grade, comments) =>{
    const query = `INSERT INTO tbl_grades (student_id, teacher_id, subject, grade, comments)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`
       const values = [student_id,teacher_id,subject, grade, comments];
       return db.query(query, values);
}

export const updateGrades = async(grade_id, grade, comments) =>{
    const query =`UPDATE tbl_grades
     SET grade=$1, comments=$2, date_assigned=NOW()
     WHERE grade_id=$3
     RETURNING *`
       const values = [grade, comments, grade_id];
       return db.query(query, values);
}

export const deleteGrade = async (grade_id) => {
  return db.query(
    `DELETE FROM tbl_grades WHERE grade_id=$1 RETURNING *`,
    [grade_id]
  );
};