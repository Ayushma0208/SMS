import express from 'express';
import { addClass} from './controller.js';

const app = express();

app.post('/add-class',addClass)

export default app;