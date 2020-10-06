import express, { Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import MongoDB from './db';
import {
    addImage,
    deleteImageById,
    getImageById,
    getImages,
    updateImage
} from './controllers/Images.controller';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(morgan(':method :status :url :response-time'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Image controller */
app.get('/api/images', getImages);
app.get('/api/images', getImageById);
app.post('/api/images', addImage);
app.put('/api/images', updateImage);
app.delete('/api/images', deleteImageById);

app.listen(PORT, async () => {
    const dbName: string = process.env.MONGODB_DBNAME || '';
    const dbUrl: string = process.env.MONGODB_URI || '';
    const db: MongoDB = new MongoDB(dbName, dbUrl);
    app.set('db', await db.connect());
});
