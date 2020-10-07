import superagent, { Response } from 'superagent';

const BASE_URL = 'http://localhost:8080/api';

describe('Image service', () => {
    let listLength: number;

    describe('Getting an image list', () => {
        it('Gets an image list from the DB', async () => {
            const imageResponse: Response = await superagent.get(`${BASE_URL}/images/`);
            expect(imageResponse.error).toBeFalsy();
            expect(imageResponse.status).toBe(200);
            expect(imageResponse.body).toBeDefined();
            listLength = imageResponse.body.length;
        });
    });

    describe('Adding images', () => {
        let imageId: string;

        it('Adds image to Cloudflare and saves the link to the DB', async () => {
            const imageData = {
                name: 'Ayvazovskiy',
                description: 'Midnight Lake',
                base64Representation: 'public/Ван Гог - Едоки картофеля.jpg'
            };

            const imageResponse: Response = await superagent
                .post(`${BASE_URL}/images/`)
                .send(imageData);

            expect(imageResponse.status).toBe(200);
            expect(imageResponse.body).toBeDefined();
            imageId = imageResponse.body.id;
        });

        it('Gets an image by id after adding to the DB', async () => {
            const imageResponse: Response = await superagent.get(
                `${BASE_URL}/images/view?id=${imageId}`
            );

            expect(imageResponse.status).toEqual(200);
            expect(imageResponse.body).toBeDefined();
            expect(imageResponse.body.image._id).toEqual(imageId);
        });

        it('Deletes an added image', async () => {
            const imageResponse: Response = await superagent
                .delete(`${BASE_URL}/images`)
                .query({ id: imageId });

            expect(imageResponse.status).toBe(200);
            expect(imageResponse.body.numberOfDeletedElements).toEqual(1);
        });

        it('Deducts the image storage after deleting image', async () => {
            const imageResponse = await superagent.get(`${BASE_URL}/images`);
            expect(imageResponse.body).toHaveLength(listLength === 0 ? listLength : listLength - 1);
        });
    });
});
