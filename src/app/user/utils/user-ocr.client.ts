import { HttpService } from '@nestjs/axios';

export class UserOcrClient {
  // TODO: OCR API 연동
  constructor(private readonly httpService: HttpService) {}

  async getScheduleFromPhoto(photo: Buffer): Promise<any[]> {
    const result = await this.httpService.axiosRef.request({
      method: 'POST',
      url: '',
    });
    return [];
  }
}
