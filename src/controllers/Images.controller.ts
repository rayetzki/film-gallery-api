import { Request, Response } from 'express';
import { Collection, Db, MongoError, ObjectId } from 'mongodb';
import { DbImage, Image } from '../models/Image.model';
import { URL } from 'url';
import {
    UploadApiErrorResponse,
    UploadApiResponse,
    ResourceApiResponse,
    v2 as cloudinary
} from 'cloudinary';

export const getImages = async (request: Request, response: Response): Promise<void> => {
    try {
        const db: Db = request.app.get('db');
        const imageDb: Collection<DbImage> = await db.collection('images');

        cloudinary.api.resources(async (error: string, images: ResourceApiResponse) => {
            if (error) response.status(500).send({ message: error });

            const collectionSize: number = await imageDb
                .find()
                .toArray()
                .then((items) => items.length);

            if (collectionSize === 0 && images.resources.length > 0) {
                const imagesList: Array<DbImage> = images.resources.map(
                    (image: ResourceApiResponse['resources'][0]) => ({
                        cloudinaryPublicId: image.public_id,
                        name: new URL(image.url).pathname.split('/').pop(),
                        url: image.url,
                        createdAt: new Date().toUTCString()
                    })
                );

                imageDb.insertMany(imagesList, (error: MongoError): void => {
                    if (error) console.error(error);
                });

                response.status(200).send(imagesList);
            } else {
                const dbImages: Array<Image> = await imageDb.find().toArray();
                response.status(200).send(dbImages);
            }
        });
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
};

export const getImageById = async (request: Request, response: Response): Promise<void> => {
    try {
        const db: Db = request.app.get('db');
        const imageCollection: Collection<DbImage> = db.collection('images');
        const imageId: string = request.query.id as string;

        if (!imageId) {
            response.status(400).send({ message: 'Please, provide image id' });
        } else {
            const image: Image | null = await imageCollection.findOne({
                _id: new ObjectId(imageId)
            });

            if (image === null) {
                response.status(404).send({ message: "Image wasn't found" });
            } else {
                response.status(200).send({ image });
            }
        }
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
};

export const addImage = async (request: Request, response: Response): Promise<void> => {
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
                    cloudinaryPublicId: uploadResult.public_id,
                    name: uploadResult.original_filename || 'Unnamed',
                    description: image.description || 'No description',
                    url: uploadResult.secure_url,
                    createdAt: new Date(uploadResult.created_at)
                };

                const insertionResponse = await db.collection('images').insertOne(imageData);
                response.status(200).send({ ...imageData, id: insertionResponse.insertedId });
            }
        }
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
};

export const deleteImageById = async (request: Request, response: Response): Promise<void> => {
    try {
        const db: Db = request.app.get('db');
        const imageId: string = request.query.id as string;
        const id: ObjectId = new ObjectId(imageId);
        const image: DbImage | null = await db.collection('images').findOne({ _id: id });

        if (image === null) {
            response.status(404).send({ message: 'Image not found' });
        } else {
            const imageCollection: Collection<DbImage> = db.collection('images');

            cloudinary.uploader.destroy(image.cloudinaryPublicId, async (error: string) => {
                if (error) {
                    response.status(500).send({ message: JSON.stringify(error) });
                }

                const deleteImageResponse = await imageCollection.deleteOne({ _id: id });

                if (deleteImageResponse.result.ok === 1) {
                    response.status(200).send({
                        numberOfDeletedElements: deleteImageResponse.result.n
                    });
                }
            });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }
};

export const updateImage = async (request: Request, response: Response): Promise<void> => {
    try {
        const db: Db = request.app.get('db');
        const imageId: string = request.query.id as string;
        const image: Image = request.body.image;

        if (!imageId || !image) {
            response.status(400).send({ message: 'Please, provide image id or image to update' });
        } else {
            const imageCollection: Collection<DbImage> = db.collection('images');

            try {
                const result = await imageCollection.findOneAndUpdate(
                    { _id: imageId },
                    { $set: { ...image } }
                );

                if (result.ok === 1) {
                    response.status(200).send({ message: 'Updated image data', image });
                } else {
                    response.status(400).send({ message: "Sorry, image wasn't found" });
                }
            } catch (error) {
                response.status(500).send({ message: error.message });
            }
        }
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
};
