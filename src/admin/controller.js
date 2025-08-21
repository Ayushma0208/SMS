import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminLogin, createUser, findAdminById, findByEmail, findByResetToken, getAdminById, isAdminExist, saveResetToken, updateAdminPassword, updatePassword } from './model.js';
import argon2  from 'argon2';
import { generateToken } from '../middleware/auth.js';

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const result = await isAdminExist(email);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "ACCOUNT ALREADY EXIST" });
    }

    const hashedPassword = await argon2.hash(password);
    const user = {
      fullName,
      email,
      password: hashedPassword,
    };

    const response = await createUser(user);
    return res.status(200).json({ message: "SIGNUP SUCCESSFULLY", user: response.rows[0] });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AdminLogin(email);

    if (!result || result.rows.length === 0) {
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const adminId = req.user.id; 
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const admin = await getAdminById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await argon2.verify(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateAdminPassword(adminId, hashedPassword);
    return res.status(202).json ({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    if (isNaN(adminId)) {
      return res.status(400).json({ success: false, message: "Invalid Admin ID" });
    }
    const admin = await findAdminById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await findByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); 


    await saveResetToken(admin.id, resetToken, resetTokenExpiry);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${admin.name},</p>
        <p>You requested to reset your password.</p>
        <p>Click <a href="${resetLink}">here</a> to reset it.</p>
        <p>This link will expire in 15 minutes.</p>
      `
    });
    return res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password required" });
    }
    const admin = await findByResetToken(token);
    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (admin.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(admin.id, hashedPassword);

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

 