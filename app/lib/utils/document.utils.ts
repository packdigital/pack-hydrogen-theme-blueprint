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
