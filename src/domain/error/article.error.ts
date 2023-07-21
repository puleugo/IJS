import { BadRequestException, NotFoundException } from '@nestjs/common';

export const ARTICLE_ERRORS = {
  ARTICLE_NOT_FOUND: 'ARTICLE_NOT_FOUND',
  ARTICLE_PERMISSION_DENIED: 'ARTICLE_PERMISSION_DENIED',
  CAN_NOT_LIKE_OWN_ARTICLE: 'CAN_NOT_LIKE_OWN_ARTICLE',
};

export class ArticleNotFoundException extends NotFoundException {
  constructor() {
    super('게시글을 찾을 수 없습니다.', ARTICLE_ERRORS.ARTICLE_NOT_FOUND);
  }
}

export class ArticlePermissionDeniedException extends BadRequestException {
  constructor() {
    super(
      '게시글에 대한 권한이 없습니다.',
      ARTICLE_ERRORS.ARTICLE_PERMISSION_DENIED,
    );
  }
}

export class CanNotLikeOwnArticleException extends BadRequestException {
  constructor() {
    super(
      '자신의 게시글에는 좋아요를 누를 수 없습니다.',
      ARTICLE_ERRORS.CAN_NOT_LIKE_OWN_ARTICLE,
    );
  }
}
