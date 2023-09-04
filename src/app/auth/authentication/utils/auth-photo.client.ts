import { PhotoClient, } from '@common/type/photo.client';
import { Injectable, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { S3, } from 'aws-sdk';
import { format, } from 'date-fns';
import * as sharp from 'sharp';
import { v4 as uuid, } from 'uuid';

@Injectable()
export class AuthPhotoClient implements PhotoClient {
    private s3!: S3;

    constructor(private readonly configService: ConfigService) {
    	this.s3 = new S3();
    }

    async uploadPhoto(photo: Buffer): Promise<string> {
    	const photoId = this.generatePhotoId();

    	return new Promise((resolve, reject) => {
    		return this.s3.upload(
    			{
    				Bucket: this.configService.get(
    					'AWS_BUCKET_NAME', 'ijs-bucket'
    				),
    				Key: photoId,
    				Body: photo,
    			}, (err, data) => {
    				if (err) return reject('UPLOAD_PHOTO_ERROR');

    				return resolve(data.Key);
    			}
    		);
    	});
    }

    async resizePhoto(photo: Buffer): Promise<Buffer> {
    	return sharp(photo).resize(544, 544).toBuffer();
    }

    private generatePhotoId(): string {
    	const timestampKey = format(new Date(), 'yyyyMMddHHmmss');
    	const photoKey = uuid();

    	return `${photoKey}_${timestampKey}.png`;
    }
}
