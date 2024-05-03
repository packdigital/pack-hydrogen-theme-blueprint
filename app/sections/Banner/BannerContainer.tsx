import kebabCase from 'lodash/kebabCase';

import type {BannerContainerProps} from './Banner.types';

const FALLBACK_DESKTOP_HEIGHT_CLASS = 'md:h-[18.75rem]';
const FALLBACK_DESKTOP_ASPECT_RATIO_CLASS = 'md:aspect-[4/1]';
const FALLBACK_DESKTOP_ASPECT_RATIO = '4 / 1';
const FALLBACK_MOBILE_HEIGHT_CLASS = 'max-md:h-[12.5rem]';
const FALLBACK_MOBILE_ASPECT_RATIO_CLASS = 'max-md:aspect-[3/1]';
const FALLBACK_MOBILE_ASPECT_RATIO = '3 / 1';

export function BannerContainer({children, cms}: BannerContainerProps) {
  const {section, image} = cms;

  // container
  const maxWidthContainerClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const fullBleedClass = section?.fullBleed ? '' : 'px-contained';

  // aspect ratio
  const desktopIsAspectRatioType =
    section?.desktop?.heightType === 'aspect-ratio';
  const desktopIsNativeAspectRatio = section?.desktop?.aspectRatio === 'native';
  const mobileIsAspectRatioType =
    section?.mobile?.heightType === 'aspect-ratio';
  const mobileIsNativeAspectRatio = section?.mobile?.aspectRatio === 'native';
  const usesDesktopNativeAspectRatio =
    desktopIsAspectRatioType && desktopIsNativeAspectRatio;
  const usesMobileNativeAspectRatio =
    mobileIsAspectRatioType && mobileIsNativeAspectRatio;

  // height
  const heightClassesDesktop = desktopIsAspectRatioType
    ? `${
        desktopIsNativeAspectRatio
          ? ''
          : section?.desktop?.aspectRatio || FALLBACK_DESKTOP_ASPECT_RATIO_CLASS
      } ${section?.desktop?.minHeight} ${section?.desktop?.maxHeight}`
    : section?.desktop?.staticHeight || FALLBACK_DESKTOP_HEIGHT_CLASS;
  const heightClassesMobile = mobileIsAspectRatioType
    ? `${
        mobileIsNativeAspectRatio
          ? ''
          : section?.mobile?.aspectRatio || FALLBACK_MOBILE_ASPECT_RATIO_CLASS
      } ${section?.mobile?.minHeight} ${section?.mobile?.maxHeight}`
    : section?.mobile?.staticHeight || FALLBACK_MOBILE_HEIGHT_CLASS;
  const heightContainerClasses = `${heightClassesMobile} ${heightClassesDesktop}`;

  /* unique class name is important to not override other banner aspect ratios */
  const nativeAspectRatiosClass = `banner-native-aspect-ratios-${kebabCase(
    cms.sectionName,
  )}-${cms.sectionVisibility}`;

  return (
    <div className={`${fullBleedClass}`}>
      {/* For dynamic media queries, it must be done outside of tailwind using a style block */}
      {(usesDesktopNativeAspectRatio || usesMobileNativeAspectRatio) && (
        <style>
          {`.${nativeAspectRatiosClass} {
                ${
                  usesMobileNativeAspectRatio
                    ? `@media (max-width: 767px) {
                        aspect-ratio: ${
                          image?.imageMobile?.aspectRatio ||
                          FALLBACK_MOBILE_ASPECT_RATIO
                        };
                      }`
                    : ''
                }
                ${
                  usesDesktopNativeAspectRatio
                    ? `@media (min-width: 768px) {
                        aspect-ratio: ${
                          image?.imageDesktop?.aspectRatio ||
                          FALLBACK_DESKTOP_ASPECT_RATIO
                        };
                      }`
                    : ''
                }
              }
            `}
        </style>
      )}

      <div
        className={`relative mx-auto ${nativeAspectRatiosClass} ${heightContainerClasses} ${maxWidthContainerClass}`}
      >
        {children}
      </div>
    </div>
  );
}

BannerContainer.displayName = 'BannerContainer';
