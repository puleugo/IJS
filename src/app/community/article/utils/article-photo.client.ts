import { PhotoClient } from '@infrastructure/utils/photo.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticlePhotoClient implements PhotoClient {
  async resizePhoto(photo: Buffer): Promise<Buffer> {
    return photo;
  }

  async uploadPhoto(photo: Buffer): Promise<string> {
    return 'https://i.imgur.com/6jZpI0L.png';
  }
}
