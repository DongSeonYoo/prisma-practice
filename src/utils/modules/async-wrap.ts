import { Request, Response, NextFunction } from 'express';

/**
 * wrapping try-catch
 * use promise
 */
const asyncWrap = (cb: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(cb(req, res, next)).catch(next);
  };
};

/**
 * wrapping try-catch
 * use asyc-await
 */
// const asyncWrap = (cb: Function) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       return await cb(req, res, next);
//     } catch (error) {
//       return next(error);
//     }
//   };
// };

export default asyncWrap;
