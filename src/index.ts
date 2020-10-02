import express, { Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import MongoDB from './db';
import {
    addImage,
    deleteImageById,
    getImageById,
    getImages
} from './controllers/Images.controller';

dotenv.config();

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinaryConfig);

const app: Express = express();
const PORT: string = process.env.PORT || '3000';

app.use(morgan(':method :status :url :response-time'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Image controller */
app.get('/images', getImages);
app.get('/image', getImageById);
app.post('/image', addImage);
app.delete('/image', deleteImageById);

app.listen(PORT, async () => {
    const dbName: string = process.env.MONGODB_DBNAME || '';
    const dbUrl: string = process.env.MONGODB_URL || '';
    const db: MongoDB = new MongoDB(dbName, dbUrl);

    app.set('mongo', await db.connect());
});
