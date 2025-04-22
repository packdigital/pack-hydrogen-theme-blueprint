import clsx from 'clsx';

import type {HeroContainerProps} from './Hero.types';

const FALLBACK_DESKTOP_HEIGHT_CLASS = 'md:h-[43.75rem]';
const FALLBACK_DESKTOP_ASPECT_RATIO_CLASS = 'md:aspect-ratio[16/9]';
const FALLBACK_DESKTOP_ASPECT_RATIO = '16 / 9';
const FALLBACK_MOBILE_HEIGHT_CLASS = 'max-md:h-[31.25rem]';
const FALLBACK_MOBILE_ASPECT_RATIO_CLASS = 'max-md:aspect-[3/4]';
const FALLBACK_MOBILE_ASPECT_RATIO = '3 / 4';

export function HeroContainer({children, cms, sectionId}: HeroContainerProps) {
  const {section, slides} = cms;

  const maxWidthContainerClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';
  const fullBleedClass = section?.fullBleed ? '' : 'px-contained';

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
  const desktopNativeAspectRatio =
    slides?.[0]?.video?.videoDesktop?.mediaType === 'VIDEO'
      ? slides?.[0]?.video?.videoDesktop?.aspectRatio
      : slides?.[0]?.image?.imageDesktop?.aspectRatio;
  const mobileNativeAspectRatio =
    slides?.[0]?.video?.videoMobile?.mediaType === 'VIDEO'
      ? slides?.[0]?.video?.videoMobile?.aspectRatio
      : slides?.[0]?.image?.imageMobile?.aspectRatio;

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

  /* unique class name is important to not override other hero aspect ratios */
  const nativeAspectRatiosClass = `hero-native-aspect-ratios-${sectionId}`;

  return (
    <div className={clsx(fullBleedClass)}>
      {/* For dynamic media queries, it must be done outside of tailwind using a style block */}
      {(usesDesktopNativeAspectRatio || usesMobileNativeAspectRatio) && (
        <style>
          {`.${nativeAspectRatiosClass}{
                ${
                  usesMobileNativeAspectRatio
                    ? `@media (max-width: 767px) {
                        aspect-ratio: ${
                          mobileNativeAspectRatio ||
                          FALLBACK_MOBILE_ASPECT_RATIO
                        };
                      }`
                    : ''
                }
                ${
                  usesDesktopNativeAspectRatio
                    ? `@media (min-width: 768px) {
                        aspect-ratio: ${
                          desktopNativeAspectRatio ||
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
        className={clsx(
          'relative mx-auto flex w-full flex-col bg-neutralLightest',
          nativeAspectRatiosClass,
          heightContainerClasses,
          maxWidthContainerClass,
        )}
      >
        {children}
      </div>
    </div>
  );
}

HeroContainer.displayName = 'HeroContainer';
