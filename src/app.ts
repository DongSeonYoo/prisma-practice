import express from 'express';
import loader from './utils/loaders';
import { env } from './configs/env';

async function startServer() {
  const app = express();
  await loader(app);

  app.listen(env.PORT, () => {
    console.log(`${env.PORT}번에서 실행`);
  });
}

startServer();
