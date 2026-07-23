import {memo, useEffect} from 'react';
import clsx from 'clsx';

import {Carousel} from '~/components/Carousel';
import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';
import {useMatchMedia, useMenu, usePromobar, useSettings} from '~/hooks';

export const Promobar = memo(() => {
  const {
    promobarDisabled,
    promobarHeightMobile,
    promobarHeightDesktop,
    promobarOpen,
    togglePromobar,
  } = usePromobar();
  const {closeAll} = useMenu();
  const {header} = useSettings();
  const isMobileViewport = useMatchMedia(
    // no need to check if mobile view if both heights are the same
    promobarHeightMobile !== promobarHeightDesktop ? '(max-width: 767px)' : '',
  );
  const {promobar} = {...header};
  const {autohide, bgColor, color, delay, effect, enabled, messages} = {
    ...promobar,
  };
  const promobarHeight = isMobileViewport
    ? promobarHeightMobile
    : promobarHeightDesktop;

  const isFade = !effect || effect === 'fade';

  useEffect(() => {
    const setPromobarVisibility = () => {
      if (document.body.style.position === 'fixed') return;
      const promobarShouldBeOpen =
        window.scrollY <=
        (typeof promobarHeight === 'string'
          ? parseInt(promobarHeight, 10)
          : Number(promobarHeight));
      if (promobarOpen && !promobarShouldBeOpen) togglePromobar(false);
      else if (!promobarOpen && promobarShouldBeOpen) togglePromobar(true);
    };

    if (!autohide) {
      togglePromobar(true);
      window.removeEventListener('scroll', setPromobarVisibility);
      return;
    }

    window.addEventListener('scroll', setPromobarVisibility);
    return () => {
      window.removeEventListener('scroll', setPromobarVisibility);
    };
  }, [autohide, promobarHeight, promobarOpen]);

  return (
    <div
      className={clsx(
        'overflow-hidden transition-[height] ease-out',
        promobarOpen && !promobarDisabled
          ? 'duration-300 max-md:h-[var(--promobar-height-mobile)] md:h-[var(--promobar-height-desktop)]'
          : 'h-0 duration-[50ms]',
      )}
      style={{backgroundColor: bgColor}}
    >
      {enabled && messages?.length ? (
        <Carousel
          ariaLabel="Promotions"
          arrowClassName="!size-6 !border-0 !bg-transparent"
          arrowColor={color}
          arrowIcon={(direction) => (
            <Svg
              className="w-3 text-current"
              src={
                direction === 'prev'
                  ? '/svgs/chevron-left.svg#chevron-left'
                  : '/svgs/chevron-right.svg#chevron-right'
              }
              title={direction === 'prev' ? 'Previous' : 'Next'}
              viewBox="0 0 24 24"
            />
          )}
          arrows={messages.length > 1}
          autoplay={delay || true}
          className="h-full"
          fade={isFade}
          options={{
            loop: messages.length > 1,
            axis: effect === 'slide-vertical' ? 'y' : 'x',
          }}
          slideClassName="px-contained"
          viewportClassName="h-full"
          slides={messages.map(({message, link}, index) => (
            <div
              className="flex min-h-full items-center justify-center text-center text-xs tracking-[0.04em] sm:text-sm"
              key={index}
              style={{color}}
            >
              <Link
                aria-label={message}
                className="select-none"
                draggable={false}
                to={link.url}
                onClick={closeAll}
                newTab={link.newTab}
                type={link.type}
              >
                {message}
              </Link>
            </div>
          ))}
        />
      ) : null}
    </div>
  );
});

Promobar.displayName = 'Promobar';
