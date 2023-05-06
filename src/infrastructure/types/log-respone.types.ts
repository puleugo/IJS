type ResponseTypes = 'success' | 'fail' | 'error';

export type LogResponseTypes = {
  status: ResponseTypes;
  message: string;
  timestamp?: Date;
  ip?: string;
};
