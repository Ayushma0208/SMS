import express from 'express';
import { loginAdmin, signUp } from './controller.js';

const app = express();

app.post('/signup',signUp)

app.post('/login',loginAdmin)

export default app;