import express from 'express';
import { getImages, deleteImageById, getAllCollections } from '../controllers/Images.controller';

const Router = express.Router();

Router.get('/', getImages);
Router.get('/collections', getAllCollections);
Router.delete('/', deleteImageById);

export default Router;
