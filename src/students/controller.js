import argon2  from 'argon2';
import { sendEmail } from "../utils/sendEmail.js"; 
import { generateToken } from "../middleware/auth.js";
import cloudinary from '../config/cloudinary.js';
import { createUser, getAllStudents, getGradesfromId, getstudentByIdModel, isUserExist, StudentclassAssign, studentDelete, updateStudent } from "./model.js";

export const signUp = async (req, res) => {
  try {
    const { fullname, email, address, dob, gender, phoneNumber, password } = req.body;

    const result = await isUserExist(email);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "ACCOUNT ALREADY EXIST" });
    }

    const hashedPassword = await argon2.hash(password);

    const user = {
      fullname,
      email,
      address,
      dob,
      gender,
      phoneNumber,
      password: hashedPassword,
    };

    const response = await createUser(user);
    const createdUser = response.rows[0];

    let emailSent = false;
    try {
      await sendEmail(
        email,
        "🎓 Welcome to School Management System",
        `<h2>Hello ${fullname},</h2><p>Your registration was successful. Welcome to the school family!</p>`
      );
      emailSent = true;
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }
    console.log("sendEmail>>>>",sendEmail)

    return res.status(200).json({
      message: "SIGNUP SUCCESSFULLY",
      emailSent,
      user: createdUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await isUserExist(email);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "USER NOT FOUND" });
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
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

// Update profile controller
export const update = async (req, res) => {
  try {
    const id = req.query.id;

    const existingStudent = await getstudentByIdModel(id);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const {
      fullname = existingStudent.fullname,
      address = existingStudent.address,
      dob = existingStudent.dob,
      phoneNumber = existingStudent.phoneNumber,
      gender = existingStudent.gender,
    } = req.body;

    let profile_image = existingStudent.profile_image;
   if (req.file) {
  const cloudinaryResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, uploadResult) => {
      if (error) reject(error);
      else resolve(uploadResult); // use different variable name
    }).end(req.file.buffer);
  });

  profile_image = cloudinaryResult.secure_url;
}

    const result = await updateStudent(fullname, address, dob, gender, phoneNumber, profile_image, id);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};


export const deleteStudent = async(req,res) =>{
    try {
        const id = req.query.id; 
        if(!id){
             return res.status(400).json({ message: "Student ID is required" });
        }
        const result = await studentDelete(id);
        if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
       return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

export const getAllStudent = async(req,res) =>{
  try{
  const data = await getAllStudents()
  res.status(200).json(data.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getStudentById = async(req,res) =>{
  try {
    const id = req.query.id
    const data =await getstudentByIdModel(id);
    res.status(200).json(data.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const assignStudentToClass = async(req,res) =>{
  try {
    const id = req.body?.id;
    console.log("id>>>>",id)
    const class_id = req.body?.class_id;
    const result = await StudentclassAssign(id,class_id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student assigned to class successfully', student: result.rows[0] });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getGradesById = async (req, res) => {
  try {
    const grade_id = parseInt(req.query.grade_id); // Extract from query
    if (isNaN(grade_id)) {
      return res.status(400).json({ message: "Invalid grade_id" });
    }

    const data = await getGradesfromId(grade_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching grade:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};