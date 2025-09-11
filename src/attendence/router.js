import express from 'express';
import { markStudentAttendance } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';


const app = express();

app.post('/student-attendence',verifyToken,authorizeRoles("admin","teacher"),markStudentAttendance)


export default app;