export const tags: SwaggerTag[] = [
  { name: 'Health Check', description: '서비스 상태 확인' },
  { name: 'Auth', description: '인증, 인가 관련 기능' },
  { name: 'University', description: '학교 정보 관련 기능' },
];

type SwaggerTag = { name: string; description: string };
