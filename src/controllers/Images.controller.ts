import { Request, Response } from 'express';
import { Db, ObjectId } from 'mongodb';
import { DbImage, Image } from '../models/Image.model';
import {
    UploadApiErrorResponse,
    UploadApiResponse,
    v2 as cloudinary
} from 'cloudinary';

export const getImages = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const db: Db = request.app.get('db');
        const images: Array<Image> = await db
            .collection('images')
            .find()
            .toArray();
        response.status(200).send(JSON.stringify(images));
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
};

export const getImageById = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const db: Db = request.app.get('db');

        const id: ObjectId = new ObjectId(String(request.query.id));

        const image: Image | null = await db
            .collection('images')
            .findOne({ _id: id });

        if (image === null) {
            response.status(404).send({ message: "Image wasn't found" });
        } else {
            response.status(200).send({ image });
        }
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
};

export const addImage = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const db: Db = request.app.get('db');
        const image: Image = request.body;

        if (image.base64Representation) {
            const uploadResult:
                | UploadApiResponse
                | UploadApiErrorResponse = await cloudinary.uploader.upload(
                image.base64Representation,
                {
                    use_filename: true,
                    unique_filename: false,
                    image_metadata: true
                }
            );

            if (uploadResult) {
                const imageData: DbImage = {
                    name: uploadResult.original_filename,
                    description: image.description || '',
                    url: uploadResult.secure_url,
                    createdAt: new Date(uploadResult.created_at)
                };

                db.collection('images').insertOne({ data: imageData });
                response.status(200).send({ message: 'success', imageData });
            }
        }
    } catch (error) {
        response.status(500).send({ message: 'Internal Server Error' });
    }
};

export const deleteImageById = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const db: Db = request.app.get('db');
        const id: ObjectId = new ObjectId(String(request.query.id));
        const image: Image | null = await db
            .collection('images')
            .findOne({ _id: id });

        if (image === null) {
            response.status(404).send({ message: 'Image not found' });
        } else {
            const deleteImageResponse = await db
                .collection('images')
                .deleteOne({ _id: id });

            if (deleteImageResponse.result.ok === 1) {
                const newImageList: Array<Image> = await db
                    .collection('images')
                    .find()
                    .toArray();
                response.status(200).send({
                    status: 'Image was deleted',
                    images: newImageList
                });
            }
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: 'Internal Server Error' });
    }
};
