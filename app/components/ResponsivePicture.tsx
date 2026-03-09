import {useMemo} from 'react';
import type {CSSProperties} from 'react';

import type {Crop, MediaCms} from '~/lib/types';

/** Must match the Tailwind `md` breakpoint in tailwind.config.js */
const MD_BREAKPOINT = '48rem';

const WIDTHS = [400, 640, 768, 1024, 1280, 1536, 1920, 2560];

function generateShopifySrcSet(url: string, crop?: Crop): string {
  return WIDTHS.map((w) => {
    const separator = url.includes('?') ? '&' : '?';
    let src = `${url}${separator}width=${w}`;
    if (crop) src += `&crop=${crop}`;
    return `${src} ${w}w`;
  }).join(', ');
}

function getFallbackSrc(url: string, width: number, crop?: Crop): string {
  const separator = url.includes('?') ? '&' : '?';
  let src = `${url}${separator}width=${width}`;
  if (crop) src += `&crop=${crop}`;
  return src;
}

interface ResponsivePictureProps {
  imageMobile: MediaCms;
  imageDesktop: MediaCms;
  alt?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizesMobile?: string;
  sizesDesktop?: string;
  cropMobile?: Crop;
  cropDesktop?: Crop;
  className?: string;
  style?: CSSProperties;
}

export function ResponsivePicture({
  imageMobile,
  imageDesktop,
  alt,
  loading = 'lazy',
  fetchPriority,
  sizesMobile = '100vw',
  sizesDesktop = '100vw',
  cropMobile,
  cropDesktop,
  className,
  style,
}: ResponsivePictureProps) {
  const mobileUrl = imageMobile.url;
  const desktopUrl = imageDesktop.url;

  const desktopSrcSet = useMemo(
    () => (desktopUrl ? generateShopifySrcSet(desktopUrl, cropDesktop) : ''),
    [desktopUrl, cropDesktop],
  );
  const mobileSrcSet = useMemo(
    () => (mobileUrl ? generateShopifySrcSet(mobileUrl, cropMobile) : ''),
    [mobileUrl, cropMobile],
  );

  if (!mobileUrl || !desktopUrl) return null;

  return (
    <picture className="block size-full">
      <source
        media={`(min-width: ${MD_BREAKPOINT})`}
        srcSet={desktopSrcSet}
        sizes={sizesDesktop}
      />
      <img
        src={getFallbackSrc(mobileUrl, 800, cropMobile)}
        srcSet={mobileSrcSet}
        sizes={sizesMobile}
        alt={alt || imageMobile.altText || imageDesktop.altText || ''}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
        style={style}
      />
    </picture>
  );
}

ResponsivePicture.displayName = 'ResponsivePicture';
