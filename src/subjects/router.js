import express from 'express';
import { addSubject, subjectAssign } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';

const app = express();

app.post('/add-subject',verifyToken,authorizeRoles("admin"),addSubject)

app.post('/subject-assign',verifyToken,authorizeRoles("admin"),subjectAssign)

export default app;