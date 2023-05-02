import { PhotoClient } from '@infrastructure/utils/photo.client';
import * as sharp from 'sharp';

export class UserPhotoClient implements PhotoClient {
  async resizePhoto(photo: Buffer): Promise<Buffer> {
    // TODO: AI 개발자 팀과 상의후 이미지 사이즈 조정
    return sharp(photo).resize(600, 600).toBuffer();
  }
}
