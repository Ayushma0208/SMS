import db from '../config/db.js';

// Check if the student exists in tbl_students
export const findStudentById = async (student_id) => {
  return db.query(
    'SELECT id FROM tbl_students WHERE id = $1',
    [student_id]
  );
};

// Check if a parent exists by email in tbl_parents
export const findParentByEmail = async (email) => {
  return db.query(
    'SELECT id, fullname, password FROM tbl_parents WHERE email = $1',
    [email]
  );
};

// Create a new parent in tbl_parents
export const createParent = async (fullname, email, hashedPassword) => {
  return db.query(
    `INSERT INTO tbl_parents (fullname, email, password)
     VALUES ($1, $2, $3) RETURNING id, fullname, email`,
    [fullname, email, hashedPassword]
  );
};

// Check if the parent-student link already exists in tbl_parents_students
export const findParentStudentMapping = async (parent_id, student_id) => {
  return db.query(
    'SELECT id FROM tbl_parents_students WHERE parent_id = $1 AND student_id = $2',
    [parent_id, student_id]
  );
};

// Create a link between parent and student in tbl_parents_students
export const createParentStudentMapping = async (parent_id, student_id) => {
  return db.query(
    `INSERT INTO tbl_parents_students (parent_id, student_id)
     VALUES ($1, $2)`,
    [parent_id, student_id]
  );
};

export const parentLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look up parent by email
    const result = await findParentByEmail(email);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const parent = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token using your existing token util
    const token = signToken({
      userId: parent.id,
      role: 'parent'
    });

    res.json({
      message: 'Login successful',
      token,
      parent: {
        id: parent.id,
        fullname: parent.fullname
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};