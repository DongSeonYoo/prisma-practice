import { Request, Response, NextFunction, Router } from 'express';
import asyncWrap from '../utils/modules/async-wrap';
import { prismaClient } from '../../prisma/prisma.client';
import { ResponseEntity } from '../utils/modules/response-entity';
import { BadRequestException } from '../utils/modules/custom-error';

const router = Router();
const tempAccountId = 1;

/**
 * DELETE /account
 * 순차적 트랜잭션 (sequential transaction)
 * 사용자를 삭제하고 사용자가 작성한 게시글, 댓글, 답글 전부 deletedAt = 현재 시간 마킹한다.
 */
// router.delete(
//   '/',
//   asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const foundUser = await prismaClient.account.findUnique({
//         where: {
//           id: tempAccountId,
//         },
//       });

//       if (!foundUser) {
//         throw new BadRequestException('해당하는 사용자가 존재하지 않습니다');
//       }

//       const deleteAccountOperation = await prismaClient.account.update({
//         data: {
//           deletedAt: new Date(),
//           Post: {
//             updateMany: {
//               data: {
//                 deletedAt: new Date(),
//               },
//               where: {
//                 accountId: tempAccountId,
//               },
//             },
//           },
//         },
//         where: {
//           id: tempAccountId,
//         },
//       });

//       return res.send(ResponseEntity.SUCCESS_WITH(deleteAccountOperation));
//     } catch (error) {
//       throw new BadRequestException('해당하는 사용자가 존재하지 않습니다');
//     }
//   }),
// );

/**
 * DELETE /account
 * * 대화형 트랜잭션 (interactive transaction)
 * * 사용자를 삭제하고 사용자가 작성한 게시글, 댓글, 답글 전부 deletedAt = 현재 시간 마킹한다.
 * 위의 순차적 트랜잭션과 동일한 동작을 하지만 
 	* 공식문서에 따르면대화형 트랜잭션에서는 해당 방법으로는 종속 쓰기가 불가능해 다른 트랜잭션에서의 접근이 불가능하다.
	* 고로 이미 계산된 id나 value를 이용해서 트랜잭션을 일으켜야 한다면 해당 방법으로 가독성 높게 트랜잭션을 처리해 줄 수 있다.

	* 내 생각에는 위에 있는 방법 (순차적 트랜잭션)은 간단한 트랜잭션과 서로 다른 트랜잭션끼리 아이디를 주고받는 (종속 쓰기)경우에 유용할것 같다.

	* 웬만해서는 이 방식을 사용하자
	* 아 또 db error 잡아주고싶으면 try-catch로 prismaKnownError로 잡아줘서 예외처리해줄수도있음
 */
router.delete(
  '/',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    const foundUser = await prismaClient.account.findUnique({
      where: {
        id: tempAccountId,
      },
    });

    if (!foundUser) throw new BadRequestException('없음유저');

    const result = await prismaClient.$transaction([
      prismaClient.account.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id: foundUser.id,
        },
      }),
      prismaClient.post.updateMany({
        data: {
          deletedAt: new Date(),
        },
        where: {
          accountId: foundUser.id,
        },
      }),
    ]);

    return res.send(ResponseEntity.SUCCESS_WITH(result));
  }),
);

/**
 * POST /account/restore
 */
router.post(
  '/restore',
  asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await prismaClient.account.update({
        where: {
          id: tempAccountId,
        },
        data: {
          deletedAt: null,
          Post: {
            updateMany: {
              data: {
                deletedAt: null,
              },
              where: {
                accountId: tempAccountId,
              },
            },
          },
        },
        select: {
          id: true,
        },
      });
      return res.send(ResponseEntity.SUCCESS_WITH(result));
    } catch (error) {
      throw new BadRequestException('해당하는 사용자가 존재하지 않습니다');
    }
  }),
);

export default router;
