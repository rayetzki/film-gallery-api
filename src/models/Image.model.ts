export interface Image {
    name?: string;
    description?: string;
    base64Representation?: string;
}

export interface DbImage extends Image {
    cloudinaryPublicId: string;
    url: string;
    createdAt: Date | string;
}
