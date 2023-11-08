import express from 'express';
const router = express.Router();
import userHandler from '../handlers/user.handler.js';

router.get('/', userHandler.getList);

export default router;
