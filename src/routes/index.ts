import { Router } from 'express';
import testRouter from './test';
import postsRouter from './post';

const router = Router();

router.use('/test', testRouter);
router.use('/posts', postsRouter);

export default router;
