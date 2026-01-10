import type {AspectRatio, Page, Section} from '~/lib/types';

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

/**
 * Validates that a url is local
 * @param url
 * @returns `true` if local `false`if external domain
 */
export function isLocalPath(url: string) {
  try {
    // We don't want to redirect cross domain,
    // doing so could create fishing vulnerability
    // If `new URL()` succeeds, it's a fully qualified
    // url which is cross domain. If it fails, it's just
    // a path, which will be the current domain.
    new URL(url);
  } catch (e) {
    return true;
  }

  return false;
}

/**
 * Extracts hero image URLs from page sections for preloading
 * Looks for Hero, Banner, and HalfHero sections marked as aboveTheFold
 * @param page - The page object containing sections
 * @returns Object with mobile and desktop hero image URLs
 */
export function getHeroImageUrls(page: Page | null): {
  mobileUrl: string | null;
  desktopUrl: string | null;
} {
  if (!page?.sections?.nodes?.length) {
    return {mobileUrl: null, desktopUrl: null};
  }

  // Find the first hero-type section that is above the fold
  const heroSection = page.sections.nodes.find((section: Section) => {
    const sectionType = section.data?._template || section.data?.type || '';
    const isHeroType = ['hero', 'banner', 'halfHero'].some((type) =>
      sectionType.toLowerCase().includes(type.toLowerCase()),
    );
    const isAboveTheFold = section.data?.section?.aboveTheFold === true;
    return isHeroType && isAboveTheFold;
  });

  if (!heroSection) {
    return {mobileUrl: null, desktopUrl: null};
  }

  const data = heroSection.data;

  // Handle Hero with slides
  if (data?.slides?.length > 0) {
    const firstSlide = data.slides[0];
    return {
      mobileUrl: firstSlide?.image?.imageMobile?.url || null,
      desktopUrl: firstSlide?.image?.imageDesktop?.url || null,
    };
  }

  // Handle Banner and HalfHero with direct image property
  if (data?.image) {
    return {
      mobileUrl: data.image?.imageMobile?.url || null,
      desktopUrl: data.image?.imageDesktop?.url || null,
    };
  }

  // Handle HalfHero with media property
  if (data?.media?.image) {
    return {
      mobileUrl: data.media.image?.imageMobile?.url || null,
      desktopUrl: data.media.image?.imageDesktop?.url || null,
    };
  }

  return {mobileUrl: null, desktopUrl: null};
}
