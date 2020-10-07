import express, { Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import MongoDB from './db';
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
app.use(cors());
app.use(morgan(':method :status :url :response-time'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/images', ImagesRoutes);

app.listen(PORT, async () => {
    const dbName: string = process.env.MONGODB_DBNAME as string;
    const dbUrl: string = process.env.MONGODB_URI as string;
    const db: MongoDB = new MongoDB(dbName, dbUrl);
    app.set('db', await db.connect());
    if (process.env.NODE_ENV === 'dev') {
        await db.drop();
    }
    console.log(`Listening on PORT: ${PORT}`);
});
