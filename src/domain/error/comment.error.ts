import { BadRequestException, NotFoundException } from '@nestjs/common';

export const COMMENT_ERRORS = {
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',
  CANT_LIKE_OWN_COMMENT: 'CANT_LIKE_OWN_COMMENT',
  COMMENT_PERMISSION_DENIED: 'COMMENT_PERMISSION_DENIED',
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

export class CommentPermissionDeniedException extends BadRequestException {
  constructor() {
    super(
      '댓글에 대한 권한이 없습니다.',
      COMMENT_ERRORS.COMMENT_PERMISSION_DENIED,
    );
  }
}
