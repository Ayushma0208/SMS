import db from '../config/db.js';

export const createSubject = async(subject) =>{
    const query = `INSERT INTO tbl_subject (subject) VALUES ($1)
    RETURNING *;`
    const value = [subject];
    return db.query(query,value)
}