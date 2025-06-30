import express from 'express';
import { getParentGrades, parentLogin, parentSignup } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';

const app = express();

app.post('/parent-signup',parentSignup)

app.post('/login',parentLogin)

app.get('/get-Students-Grades',verifyToken,authorizeRoles('parent'),getParentGrades)

export default app;