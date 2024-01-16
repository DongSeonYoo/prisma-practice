import { Router, Request, Response, NextFunction } from 'express';
import asyncWrap from '../utils/modules/async-wrap';
import { prismaClient } from '../../prisma/prisma.client';
import { validate } from '../utils/modules/validater';
import { BadRequestException, NotFoundException } from '../utils/modules/custom-error';
import { ResponseEntity } from '../utils/modules/response-entity';
import { Prisma } from '@prisma/client';

const router = Router();

/**
 * page: 가져올 페이지
 * limit: 한 페이지에 몇개 줄건지 (10개줄랭)
 */
router.get(
  '/list',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    const { page } = req.query;

    validate(page, 'page').checkInput().isNumber();

    // 한 페이지에 10개
    const offset = (Number(page) - 1) * 10;

    const postsResult = await prismaClient.post.findMany({
      select: {
        id: true,
        accountId: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: offset,
      take: 10,
    });

    return res.send(ResponseEntity.SUCCESS_WITH(postsResult));
  }),
);

/**
 * DELETE /posts/delete
 * 게시글 삭제
 */
router.delete(
  '/delete',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.body;
    validate(postId, 'postId').checkInput().isNumber();

    try {
      const result = await prismaClient.post.findUnique({
        where: {
          id: Number(postId),
        },
      });

      if (!result) {
        throw new BadRequestException('해당하는 게시글이 존재하지 않습니다');
      }

      const deletePostResult = await prismaClient.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return res.send(ResponseEntity.SUCCESS_WITH(deletePostResult));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('해당하는 게시글이 존재하지 않습니다');
        }
      }

      return next(error);
    }
  }),
);

/**
 * GET /posts/count
 */
router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
  const count = await prismaClient.post.count();

  return res.send(ResponseEntity.SUCCESS_WITH({ count }));
});

/**
 * GET /posts/:postId
 * 특정 게시글의 아이디로 게시글 정보 가져옴
 */
router.get(
  '/:postId',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    validate(postId, 'postId').checkInput().isNumber();

    const post = await prismaClient.post.findUnique({
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

export default router;
