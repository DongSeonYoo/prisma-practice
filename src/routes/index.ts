import { Router } from 'express';
import testRouter from './test';
import postsRouter from './post';
import accountRouter from './account';

const router = Router();

router.use('/test', testRouter);
router.use('/posts', postsRouter);
router.use('/account', accountRouter);

export default router;
