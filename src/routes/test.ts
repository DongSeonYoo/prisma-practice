import { NextFunction, Router, Response, Request } from 'express';
import { BadRequestException, NotFoundException } from '../utils/modules/custom-error';
import { ResponseEntity } from '../utils/modules/response-entity';
import { validate } from '../utils/modules/validater';
import asyncWrap from '../utils/modules/async-wrap';
import { prismaClient } from '../../prisma/prisma.client';
import { Prisma } from '@prisma/client';

const router = Router();

/**
 * POST /test/account
 * 테스트 유저 생성
 */
router.post(
  '/account',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    const createdResult = await prismaClient.account.create({
      data: {
        loginId: 'test1',
        password: 'qwerqwerqwerqwerqwer',
        email: 'test1@naver.com',
        name: 'test1Name',
        phoneNumber: '01011111111',
        profileImg: 'profile.img',
      },
      select: {
        id: true,
      },
    });

    return res.send(ResponseEntity.SUCCESS_WITH(createdResult));
  }),
);

/**
 * POST /test/post/push
 * 100개 insert
 */
router.post(
  '/posts/push',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    for (let i = 1; i <= 100; i++) {
      await prismaClient.post.create({
        data: {
          accountId: 1,
          title: `title ${i}`,
          content: `content ${i}`,
        },
      });
    }

    return res.send(ResponseEntity.SUCCESS());
  }),
);

// throw error test
router.post(
  '/error',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException('Error');
  }),
);

export default router;
