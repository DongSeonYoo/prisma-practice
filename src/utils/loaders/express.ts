import { Application, json } from 'express';
import routes from '../../routes';
import cookieParser from 'cookie-parser';
import errorHandling from '../../middlewares/error-handling';

export default function (app: Application) {
  app.use(json());
  app.use(cookieParser());
  app.use('/', routes);
  app.use(errorHandling);
}
