import express from 'express';
import { getQuizQuestions } from './controller.js';
const router = express.Router();

router.get("/get-quiz", getQuizQuestions);

export default router;