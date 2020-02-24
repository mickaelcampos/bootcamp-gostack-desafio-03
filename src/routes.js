import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DistributionController from './app/controllers/DistributionController';

import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/delivery/:id', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);

routes.delete('/delivery/:id', DeliveryController.delete);

routes.get('/deliveryman/:id/deliveries', DistributionController.index);
routes.put('/delivery', DistributionController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
