import express from 'express'
import { deleteTeacher, getAllTeachers, loginTeacher, signupTeacher, updateTeacher } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';

const app = express();

app.post('/signup',verifyToken,authorizeRoles("admin"),signupTeacher)

app.post('/loginTeacher',loginTeacher);

app.post('/updateTeacher',verifyToken,authorizeRoles("admin","teacher"),updateTeacher)

app.delete('/deleteTeacher',verifyToken,authorizeRoles("admin"),deleteTeacher)

app.get('/get-allTeachers',verifyToken,authorizeRoles("admin"),getAllTeachers)


export default app;