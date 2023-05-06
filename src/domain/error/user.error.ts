import { BadRequestException, NotFoundException } from '@nestjs/common';

export const USER_ERRORS = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_UNAUTHENTICATED: 'USER_UNAUTHENTICATED',
};

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('회원을 찾을 수 없습니다.', USER_ERRORS.USER_NOT_FOUND);
  }
}

export class UserUnauthenticated extends BadRequestException {
  constructor() {
    super('학생 인증이 필요합니다.', USER_ERRORS.USER_UNAUTHENTICATED);
  }
}
