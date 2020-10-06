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
Router.get('/:id', getImageById);
Router.post('/', addImage);
Router.put('/:id', updateImage);
Router.delete('/:id', deleteImageById);

export default Router;
