import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary';
import MongoDB from './db';

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinaryConfig);

const app = express();
const PORT: string = process.env.SERVER_PORT || '3000';

app.use(morgan(':method :url :response-time'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/upload-image', async (request: Request, response: Response) => {
    try {
        const result = await cloudinary.uploader.upload(request.body.image);

        if (result) {
            response.status(200).send({ message: 'success', result });
        }
    } catch (error) {
        response.status(500).send({ message: 'Internal server error' });
    }
});

app.listen(PORT, async () => {
    dotenv.config();
    await MongoDB.init();
    console.log(MongoDB.getDb());
});
