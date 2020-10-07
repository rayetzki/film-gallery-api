import express from 'express';
import {
    getImages,
    getImageById,
    addImage,
    updateImage,
    deleteImageById
} from '../controllers/Images.controller';

const Router = express.Router();

Router.get('/', getImages);
Router.get('/view', getImageById);
Router.post('/', addImage);
Router.put('/', updateImage);
Router.delete('/', deleteImageById);

export default Router;
