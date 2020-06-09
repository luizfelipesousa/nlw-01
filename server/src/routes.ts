import Router, { request, response } from 'express';
import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';
const routes = Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointsCrontroller = new PointsController();

routes.get('/items', itemsController.index);
routes.get('/items/:id', itemsController.show);

routes.get('/points', pointsCrontroller.index);
routes.get('/points/:id', pointsCrontroller.show);

routes.post('/points', upload.single('image'), celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required()
    })
}, { abortEarly: false }), pointsCrontroller.create);

export default routes;