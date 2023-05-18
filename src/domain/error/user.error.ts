import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export const USER_ERRORS = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_UNAUTHENTICATED: 'USER_UNAUTHENTICATED',
  USER_FOUND: 'USER_FOUND',
  USER_ALREADY_JOIN: 'USER_ALREADY_JOIN',
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

export class DuplicatiedUserException extends ConflictException {
  constructor() {
    super('이미 가입된 회원입니다.', USER_ERRORS.USER_FOUND);
  }
}

export class UserAlreadyJoin extends ConflictException {
  constructor() {
  super('이미 참여한 회원입니다.', USER_ERRORS.USER_ALREADY_JOIN);
  }
}
