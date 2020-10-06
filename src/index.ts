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
const PORT: number = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(morgan(':method :status :url :response-time'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Image controller */
app.get('/api/images', getImages);
app.get('/api/image', getImageById);
app.post('/api/image', addImage);
app.delete('/api/image', deleteImageById);

app.listen(PORT, async () => {
    const dbName = process.env.MONGODB_DBNAME;
    const dbUrl = process.env.MONGODB_URI;
    const db: MongoDB = new MongoDB(dbName, dbUrl);
    app.set('db', await db.connect());
});
