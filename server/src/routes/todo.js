import express from 'express';
import jwt from 'jsonwebtoken';

import { authenticateJWT, createTodo } from '../controllers/todo.js';

const router = express.Router();

router.post('/todo', authenticateJWT, createTodo);

export default router;
