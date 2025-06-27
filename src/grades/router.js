import express from 'express';
import { addGrades, removeGrade, updateGrade } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';


const app = express();

app.post('/post-grades',verifyToken,authorizeRoles("teacher"),addGrades)

app.post('/update-grade',verifyToken,authorizeRoles("teacher"),updateGrade);

app.delete('/delete-grades',verifyToken,authorizeRoles("teacher"),removeGrade)

export default app;