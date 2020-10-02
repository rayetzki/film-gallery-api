import { Request, Response } from 'express';
import { Db } from 'mongodb';
import { Image } from '../models/Image.model';

export const getImages = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const db: Db = request.app.get('mongo');
        const images: Array<Image> = await db
            .collection('images')
            .find()
            .toArray();
        response.status(200).send(JSON.stringify(images));
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
};
