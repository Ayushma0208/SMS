import argon2  from 'argon2';
import { createTeacher, getAllTeacher, isTeacherExist, teacherDelete, teacherLogin, teacherUpdate } from "./model.js";
import { generateToken } from '../middleware/auth.js';

export const signupTeacher = async(req,res) =>{
    const {fullName,email,password,phone,address,subject,qualification,experience,date_of_birth} = req.body;
    const data = await isTeacherExist(email);
    if (data.rows.length > 0) {
      return res.status(400).json({ message: "ACCOUNT ALREADY EXIST" });
    }
    const hashedPassword = await argon2.hash(password);
    const user = {fullName,
        email,
        password:hashedPassword,
        phone,
        address,
        subject,
        qualification,
        experience,
        date_of_birth
    }
    const response = await createTeacher(user);
    return res.status(200).json({ message: "SIGNUP SUCCESSFULLY", user: response.rows[0] });
}

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await teacherLogin(email);

    if (!result || result.rows.length === 0) {
      return res.status(400).json({ message: "TEACHER NOT FOUND" });
    }

    const user = result.rows[0];
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    return res.status(200).json({ message: "Login Successfully", token });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTeacher = async(req,res) =>{
  try {
      const teacherid = req.query.id;
  const{fullname,phone,address,subject,qualification,experience,date_of_birth} = req.body;
  const result = await teacherUpdate(teacherid,fullname,phone,address,subject,qualification,experience,date_of_birth);
     if (result.rowCount === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    return res.status(200).json({ message: "Teacher updated successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteTeacher = async(req,res) =>{
  const id = req.query.id;
  if(!id){
     return res.status(400).json({ message: "Student ID is required" });
  }
   const result = await teacherDelete(id);
          if (result.rowCount === 0) {
        return res.status(404).json({ message: "Student not found" });
      }
         return res.status(200).json({ message: "Teacher deleted successfully" });
}

export const getAllTeachers = async(req,res) =>{
  const data = await getAllTeacher();
  res.status(200).json(data.rows)
}

//testing2