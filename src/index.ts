import express, { Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import ImagesRoutes from './routes/Images.routes';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app: Express = express();
const PORT: number = (process.env.PORT || 8080) as number;

app.disable('etag');
app.use(
    cors({
        origin: [
            'http://localhost:8080',
            'http://localhost:3000',
            'https://rayetzki-35.netlify.app'
        ]
    })
);
app.use(morgan(':method :status :url :response-time'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/images', ImagesRoutes);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
