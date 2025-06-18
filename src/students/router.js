import express from 'express'
import { deleteStudent, login, signUp, update } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';


const app = express();

app.post('/signup',signUp)

app.post('/login',verifyToken,authorizeRoles("admin","teacher"),login)

app.post('/update-student',verifyToken,authorizeRoles("admin","teacher"),update)

app.delete('/deleteStudent',verifyToken,authorizeRoles("teacher"),deleteStudent)

export default app;