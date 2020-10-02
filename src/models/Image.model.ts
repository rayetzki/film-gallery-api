export interface Image {
    description?: string;
    base64Representation?: string;
}

export interface DbImage extends Image {
    name: string;
    url: string;
    createdAt: Date;
}
