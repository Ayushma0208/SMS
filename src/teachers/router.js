import express from 'express'
import { loginTeacher, signupTeacher, updateTeacher } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';

const app = express();

app.post('/signup',verifyToken,authorizeRoles("admin"),signupTeacher)

app.post('/loginTeacher',loginTeacher);

app.post('/updateTeacher',verifyToken,authorizeRoles("admin","teacher"),updateTeacher)

export default app;