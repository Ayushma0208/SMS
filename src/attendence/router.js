import express from 'express';
import { markStudentAttendance } from './controller.js';

const app = express();

app.post('/student-attendence',markStudentAttendance)

//test
export default app;