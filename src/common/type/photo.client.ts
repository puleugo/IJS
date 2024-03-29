export type PhotoClient = {
    uploadPhoto?(photo: Buffer): Promise<string>;
    resizePhoto(photo: Buffer): Promise<Buffer>;
};
