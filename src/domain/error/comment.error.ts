import { BadRequestException, NotFoundException } from '@nestjs/common';

export const COMMENT_ERRORS = {
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  CANT_LIKE_OWN_COMMENT: 'CANT_LIKE_OWN_COMMENT',
  COMMENT_PERMISSION_DENIED: 'COMMENT_PERMISSION_DENIED',
  ALREADY_LIKED_COMMENT: 'ALREADY_LIKED_COMMENT',
  FAILED_TO_LIKE_COMMENT: 'FAILED_TO_LIKE_COMMENT',
};

export class CommentNotFoundException extends NotFoundException {
  constructor() {
    super('댓글을 찾을 수 없습니다.', COMMENT_ERRORS.COMMENT_NOT_FOUND);
  }
}

export class CantLikeOwnCommentException extends BadRequestException {
  constructor() {
    super(
      '자신의 댓글에는 좋아요를 누를 수 없습니다.',
      COMMENT_ERRORS.CANT_LIKE_OWN_COMMENT,
    );
  }
}

export class AlreadyLikedCommentException extends BadRequestException {
  constructor() {
    super(
      '이미 좋아요가 눌려져있습니다.',
      COMMENT_ERRORS.ALREADY_LIKED_COMMENT,
    );
  }
}

export class CommentPermissionDeniedException extends BadRequestException {
  constructor() {
    super(
      '댓글에 대한 권한이 없습니다.',
      COMMENT_ERRORS.COMMENT_PERMISSION_DENIED,
    );
  }
}

export class FailedToLikeCommentException extends BadRequestException {
  constructor() {
    super(
      '댓글에 좋아요를 누를 수 없습니다.',
      COMMENT_ERRORS.FAILED_TO_LIKE_COMMENT,
    );
  }
}
