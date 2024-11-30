import { deleteCookie, setCookie } from './cookie';

export const storeTokens = (
  refreshToken: string,
  accessToken: string
): void => {
  localStorage.setItem('refreshToken', refreshToken);

  setCookie('accessToken', accessToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem('refreshToken');

  deleteCookie('accessToken');
};
