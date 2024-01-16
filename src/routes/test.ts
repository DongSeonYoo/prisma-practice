import { PrismaClient } from '@prisma/client';
import { NextFunction, Router, Response, Request } from 'express';
import { BadRequestException, NotFoundException } from '../utils/modules/custom-error';
import { ResponseEntity } from '../utils/modules/response-entity';
import { validate } from '../utils/modules/validater';
import asyncWrap from '../utils/modules/async-wrap';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /test/posts
 */
router.get('/post-count', async (req: Request, res: Response, next: NextFunction) => {
  const count = await prisma.post_tb.count();

  return res.send(ResponseEntity.SUCCESS_WITH({ count }));
});

router.get(
  '/post/:postId',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    validate(postId, 'postId').checkInput().isNumber();

    const post = await prisma.post_tb.findUnique({
      where: {
        id: parseInt(postId),
      },
    });

    if (!post) {
      throw new NotFoundException('해당하는 게시글이 존재하지 않습니다');
    }

    return res.send(ResponseEntity.SUCCESS_WITH(post));
  }),
);

// 100개 insert
router.post(
  '/push',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    for (let i = 1; i <= 100; i++) {
      await prisma.post_tb.create({
        data: {
          user_id: 11,
          title: `title ${i}`,
          content: `content ${i}`,
        },
      });
    }

    return res.send('success');
  }),
);

// throw error test
router.get(
  '/error',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException('Error');
  }),
);

export default router;
