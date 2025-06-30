import { generateToken } from "../middleware/auth.js";
import { createParent, createParentStudentMapping, findParentByEmail, findParentStudentMapping, findStudentById, getGradesForParent } from "./model.js";
import argon2  from 'argon2';

export const parentSignup = async (req, res) => {
  const { fullname, email, password, student_id } = req.body;

  try {
    // 1️⃣ Check if the student exists
    const studentCheck = await findStudentById(student_id);
    if (studentCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Student not found' });
    }

    // 2️⃣ Check if parent already exists by email
    let parent = await findParentByEmail(email);
    let parentId;

    if (parent.rowCount === 0) {
      // Parent does not exist → create
      const hashedPassword = await argon2.hash(password, 10);
      const newParent = await createParent(fullname, email, hashedPassword);
      parentId = newParent.rows[0].id;
    } else {
      parentId = parent.rows[0].id;
    }

    // 3️⃣ Check if this parent-student link already exists
    const mapping = await findParentStudentMapping(parentId, student_id);
    if (mapping.rowCount > 0) {
      return res.status(400).json({ message: 'Parent is already assigned to this student' });
    }

    // 4️⃣ Create parent-student mapping
    await createParentStudentMapping(parentId, student_id);

    res.status(201).json({ message: 'Parent registered and assigned to student', parent_id: parentId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
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
    const isMatch = await argon2.verify(parent.password,password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token using your existing token util
    const token = generateToken({userId: parent.id,role: 'parent'});

    return res.json({message: 'Login successful',token,parent: {id: parent.id,fullname: parent.fullname}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getParentGrades = async (req, res) => {
  try {
    const parentId = parseInt(req.query.parentId);

    if (!parentId) {
      return res.status(400).json({ message: 'Invalid parent ID' });
    }

    const grades = await getGradesForParent(parentId);

    res.status(200).json({
      success: true,
      data: grades,
    });
  } catch (error) {
    console.error('Error fetching grades for parent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades',
    });
  }
};
