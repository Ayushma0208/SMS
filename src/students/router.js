import express from 'express'
import { assignStudentToClass, deleteStudent, getAllStudent, getGradesById, getStudentById, login, signUp, update } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';



const app = express();

app.post('/signup',signUp)

app.post('/login',verifyToken,authorizeRoles("admin","teacher"),login)

app.post('/update-student', upload.single('profile_image'),update)

app.delete('/deleteStudent',verifyToken,authorizeRoles("teacher"),deleteStudent)

app.get('/get-Allstudents',verifyToken,authorizeRoles("teacher","admin"),getAllStudent)

app.get('/get-Student-ById',verifyToken,authorizeRoles("teacher","admin"),getStudentById)

app.post('/assign-student-to-class',assignStudentToClass)

app.get('/get-grades-ById',getGradesById)

export default app;