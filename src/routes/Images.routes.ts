import express from 'express';
import {
    getImages,
    getImageById,
    addImage,
    updateImage,
    deleteImageById,
    getAllCollections
} from '../controllers/Images.controller';

const Router = express.Router();

Router.get('/', getImages);
Router.get('/collections', getAllCollections);
Router.get('/view', getImageById);
Router.post('/', addImage);
Router.put('/', updateImage);
Router.delete('/', deleteImageById);

export default Router;
