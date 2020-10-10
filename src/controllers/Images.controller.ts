import { Request, Response } from 'express';
import { ResourceApiResponse, v2 as cloudinary } from 'cloudinary';

export const getAllCollections = async (request: Request, response: Response): Promise<void> => {
    try {
        cloudinary.api.root_folders((error: unknown, callResult) => {
            if (error) response.send(JSON.stringify(error));
            if (callResult?.folders?.length > 0) {
                const foldersList: Array<string> = callResult.folders.map(
                    (folder: Record<string, string>) => folder.name
                );
                response.send(foldersList);
            } else response.send([]);
        });
    } catch (error) {
        response.sendStatus(500);
    }
};

export const getImages = async (request: Request, response: Response): Promise<void> => {
    try {
        const prefix = request.query.prefix;

        cloudinary.api.resources(
            { max_results: 500, prefix, type: 'upload' },
            async (error: unknown, images: ResourceApiResponse) => {
                if (error) response.status(500).send({ message: error });

                if (images?.resources.length > 0) {
                    response.status(200).send(images.resources);
                } else {
                    response.status(200).send([]);
                }
            }
        );
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
};

export const deleteImageById = async (request: Request, response: Response): Promise<void> => {
    try {
        const imageId: string = request.query.cloudinaryPublicId as string;

        cloudinary.uploader.destroy(imageId, async (error: string) => {
            if (error) {
                console.error(error);
                response.status(500).send({ message: JSON.stringify(error) });
            }

            response.status(200).send('success');
        });
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }
};
