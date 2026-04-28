import request from '@/utils/request';

export type LoginParams = {
  username: string;
  password: string;
  code: string;
};

export type LoginResult = {
  token?: string;
  accessToken?: string;
};

export const loginApi = (data: LoginParams) => {
  return request.post<LoginResult, LoginParams>('/login', data);
};
