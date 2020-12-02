import express, { Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import ImagesRoutes from './routes/Images.routes';
import { allowedNodeEnvironmentFlags } from 'process';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app: Express = express();
const PORT: number = (process.env.PORT || 8080) as number;

app.disable('etag');
app.use(morgan(':method :status :url :response-time'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ['https://film-ray.netlify.app', 'http://194.42.112.46:3000']
    })
);
app.use('/api/images', ImagesRoutes);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
