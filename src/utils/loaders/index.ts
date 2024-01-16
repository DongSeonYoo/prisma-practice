import { Application } from 'express';
import expressLoader from './express';

export default async function (app: Application) {
  expressLoader(app);
}
