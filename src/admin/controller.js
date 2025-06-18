import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminLogin, createUser, isAdminExist } from './model.js';
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

 