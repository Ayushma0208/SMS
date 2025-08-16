import express from 'express';
import { changePassword, forgotPassword, getAdminProfile, loginAdmin, signUp } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';

const app = express();

app.post('/signup',signUp)

app.post('/login',loginAdmin)

app.get("/admin",verifyToken,authorizeRoles("admin"), getAdminProfile);

app.post("/change-password", verifyToken,authorizeRoles("admin"), changePassword);

app.post("/forgot-password", forgotPassword);
export default app;