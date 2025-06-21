import express from 'express';
import { markStudentAttendance } from './controller.js';

const app = express();

app.post('/student-attendence',markStudentAttendance)

//testing 2 in development

export default app;