import db from '../config/db.js';

export const insertClass = async (classname) => {
  return db.query(
    `INSERT INTO tbl_class (classname, createdat, updatedat)
     VALUES ($1, NOW(), NOW()) RETURNING *`,
    [classname]
  );
};