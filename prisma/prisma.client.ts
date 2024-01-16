import { PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient().$extends({
  query: {
    $allModels: {
      $allOperations({ model, operation, args, query }) {
        if (operation === 'findUnique' || operation === 'findMany' || operation === 'findFirst') {
          args.where = { deletedAt: null, ...args.where };
        }

        return query(args);
      },
    },
  },
});
