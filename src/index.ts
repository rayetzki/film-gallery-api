import express, { Request, Response, Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import MongoDB from './db';

dotenv.config();

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinaryConfig);

const app: Express = express();
const PORT: string = process.env.PORT || '3000';

app.use(morgan(':method :url :response-time'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
    '/upload-image',
    bodyParser,
    async (request: Request, response: Response) => {
        try {
            const result = await cloudinary.uploader.upload(request.body.image);

            if (result) {
                response.status(200).send({ message: 'success', result });
            }
        } catch (error) {
            response.status(500).send({ message: 'Internal server error' });
        }
    }
);

app.listen(PORT, async () => {
    const dbName = process.env.MONGODB_DBNAME || '';
    const dbUrl = process.env.MONGODB_URL || '';
    const db: MongoDB = new MongoDB(dbName, dbUrl);

    app.set('mongo', await db.connect());
});
