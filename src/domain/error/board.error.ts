import { NotFoundException } from '@nestjs/common';

export const BOARD_ERRORS = {
  BOARD_NOT_FOUND: 'BOARD_NOT_FOUND',
};

export class BoardNotFoundException extends NotFoundException {
  constructor() {
    super('게시판을 찾을 수 없습니다.', BOARD_ERRORS.BOARD_NOT_FOUND);
  }
}
