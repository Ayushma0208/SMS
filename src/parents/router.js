import express from 'express';
import { parentLogin, parentSignup } from './controller.js';

const app = express();

app.post('/parent-signup',parentSignup)

app.post('/login',parentLogin)

export default app;