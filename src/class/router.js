import express from 'express';
import { addClass, assignClass} from './controller.js';
import { authorizeRoles, verifyToken } from '../middleware/auth.js';

const app = express();

app.post('/add-class',verifyToken,authorizeRoles("admin"),addClass)

app.post('/assign-teacher-to-class', assignClass)

export default app;