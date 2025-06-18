import db from '../config/db.js';

export const createSubject = async(subject) =>{
    const query = `INSERT INTO tbl_subject (subject) VALUES ($1)
    RETURNING *;`
    const value = [subject];
    return db.query(query,value)
}

export const assignSuject = async(subject_id,teacher_id) =>{
    const query = `INSERT INTO tbl_subject_assign (subject_id,teacher_id) VALUES ($1,$2)
    RETURNING *;`
    const value = [subject_id,teacher_id];
    return db.query(query,value)
}