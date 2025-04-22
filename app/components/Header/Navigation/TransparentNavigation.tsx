import {memo, useEffect, useState} from 'react';
import clsx from 'clsx';

import {HEADER_NAVIGATION} from '~/lib/constants';
import {useSettings} from '~/hooks';

import {NavigationCart} from './NavigationCart';
import {NavigationLogo} from './NavigationLogo';

export const TransparentNavigation = memo(() => {
  const {header} = useSettings();

  const [isScrolled, setIsScrolled] = useState(false);

  const {logoPositionDesktop, transparentNav} = {
    ...header?.menu,
  };
  const {
    iconColor = 'var(--white)',
    isChangeColorsOnScroll = true,
    pixelOffsetChangeColors = 100,
    scrolledBgColor = 'var(--background)',
    scrolledIconColor = 'var(--text)',
  } = {...transparentNav};
  const gridColsClassDesktop =
    logoPositionDesktop === 'center'
      ? 'lg:grid-cols-[1fr_auto_1fr]'
      : 'lg:grid-cols-[auto_1fr_auto]';
  const logoOrderClassDesktop =
    logoPositionDesktop === 'center' ? 'lg:order-2' : 'lg:order-1';
  const menuOrderClassDesktop =
    logoPositionDesktop === 'center' ? 'lg:order-1' : 'lg:order-2';

  useEffect(() => {
    const setScrolledNav = () => {
      const scrolledNavIsActive = window.scrollY > pixelOffsetChangeColors;
      if (isScrolled && !scrolledNavIsActive) setIsScrolled(false);
      else if (!isScrolled && scrolledNavIsActive) setIsScrolled(true);
    };

    if (!isChangeColorsOnScroll) {
      if (isScrolled) setIsScrolled(false);
      window.removeEventListener('scroll', setScrolledNav);
      return;
    }

    window.addEventListener('scroll', setScrolledNav);
    return () => {
      window.removeEventListener('scroll', setScrolledNav);
    };
  }, [isChangeColorsOnScroll, isScrolled, pixelOffsetChangeColors]);

  return (
    <nav
      className={clsx(
        'px-contained relative z-[1] grid flex-1 grid-cols-[1fr_auto_1fr] gap-4 transition md:gap-8',
        gridColsClassDesktop,
      )}
      data-comp={HEADER_NAVIGATION}
      style={{backgroundColor: isScrolled ? scrolledBgColor : 'transparent'}}
    >
      <div className={clsx('order-2 flex items-center', logoOrderClassDesktop)}>
        <NavigationLogo
          className="transition"
          color={isScrolled ? scrolledIconColor : iconColor}
        />
      </div>

      <div
        className={clsx('order-1 flex items-center', menuOrderClassDesktop)}
      />

      <div className="order-3 flex items-center justify-end gap-4 md:gap-5">
        <NavigationCart
          className="transition"
          color={isScrolled ? scrolledIconColor : iconColor}
        />
      </div>
    </nav>
  );
});

TransparentNavigation.displayName = 'TransparentNavigation';
