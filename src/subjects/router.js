import express from 'express';
import { addSubject } from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';

const app = express();

app.post('/add-subject',verifyToken,authorizeRoles("admin"),addSubject)

export default app;