import type {AspectRatio} from '~/lib/types';

export const isLightHexColor = (hex: string | undefined) => {
  if (!hex || typeof hex !== 'string') return undefined;
  const hexArr = hex.toLowerCase().split('#').pop()?.split('');
  if (!hexArr) return undefined;
  const chars =
    hexArr.length === 3
      ? [hexArr[0], hexArr[2]]
      : [hexArr[0], hexArr[2], hexArr[4]];
  return chars.every((char) => ['f', 'e', 'd'].includes(char));
};

export const getAspectRatioFromClass = (
  className: string | undefined,
): AspectRatio | undefined => {
  if (!className) return undefined;
  const aspectRatio = className.match(/\[(.*?)\]/);
  if (!aspectRatio) return undefined;
  return aspectRatio[1] as AspectRatio;
};

export const getAspectRatioFromPercentage = (
  percentage: string | undefined,
): AspectRatio | undefined => {
  if (!percentage) return undefined;
  const match = percentage.match(/\d+/);
  if (!match) return undefined;
  const number = parseInt(match[0], 10);
  return `1/${number / 100}` as AspectRatio;
};

export const getCookieDomain = (url: string) => {
  try {
    const {hostname} = new URL(url);
    const domainParts = hostname.split('.');
    return `.${
      domainParts.length > 2 ? domainParts.slice(-2).join('.') : hostname
    }`;
  } catch (error) {
    console.error(`getCookieDomain:error:`, error);
    return '';
  }
};

export const getExpirationDate = (days = 1) => {
  const now = new Date();
  const time = now.getTime();
  const expireTime = time + 1000 * 86400 * days;
  now.setTime(expireTime);
  return now;
};

export const deleteCookie = (cookieName: string) => {
  document.cookie = `${cookieName}=; Expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};
