import express from 'express';
import { changePassword, getAdminProfile, loginAdmin, signUp } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';

const app = express();

app.post('/signup',signUp)

app.post('/login',loginAdmin)

app.get("/admin", getAdminProfile);

app.post("/change-password", verifyToken,authorizeRoles("admin","teacher"), changePassword);

export default app;