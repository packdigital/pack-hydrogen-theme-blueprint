import {useEffect} from 'react';
import type {SwiperProps} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, EffectFade, Autoplay, Navigation} from 'swiper/modules';

import {Link} from '~/components';
import {useGlobal, useMatchMedia, usePromobar, useSettings} from '~/hooks';

export function Promobar() {
  const {
    promobarDisabled,
    promobarHeightMobile,
    promobarHeightDesktop,
    promobarOpen,
    togglePromobar,
  } = usePromobar();
  const {closeAll} = useGlobal();
  const {header} = useSettings();
  const isMobileViewport = useMatchMedia(
    // no need to check if mobile view if both heights are the same
    promobarHeightMobile !== promobarHeightDesktop ? '(max-width: 767px)' : '',
  );
  const {promobar} = {...header};
  const {autohide, bgColor, color, delay, effect, enabled, messages, speed} = {
    ...promobar,
  };
  const promobarHeight = isMobileViewport
    ? promobarHeightMobile
    : promobarHeightDesktop;

  const swiperParams = {
    autoplay: {
      delay: delay || 5000,
      disableOnInteraction: false,
    },
    direction: effect === 'slide-vertical' ? 'vertical' : 'horizontal',
    effect: effect?.split('-')[0] || 'fade',
    fadeEffect: {
      crossFade: true,
    },
    loop: messages?.length > 1,
    modules: [A11y, Autoplay, EffectFade, Navigation],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    speed: speed || 500,
    style: {
      '--swiper-navigation-color': color,
      '--swiper-navigation-size': '12px',
    },
  } as SwiperProps;

  useEffect(() => {
    const setPromobarVisibility = () => {
      if (document.body.style.position === 'fixed') return;
      togglePromobar(
        window.scrollY <=
          (typeof promobarHeight === 'string'
            ? parseInt(promobarHeight, 10)
            : Number(promobarHeight)),
      );
    };

    if (!autohide) {
      togglePromobar(true);
      window.removeEventListener('scroll', setPromobarVisibility);
      return undefined;
    }

    window.addEventListener('scroll', setPromobarVisibility);
    return () => {
      window.removeEventListener('scroll', setPromobarVisibility);
    };
  }, [autohide, promobarHeight]);

  return (
    <div
      className={`overflow-hidden transition-[height] ease-out ${
        promobarOpen && !promobarDisabled
          ? 'duration-300 max-md:h-[var(--promobar-height-mobile)] md:h-[var(--promobar-height-desktop)]'
          : 'h-0 duration-[50ms]'
      }`}
      style={{backgroundColor: bgColor}}
    >
      {enabled && messages?.length ? (
        <Swiper
          {...swiperParams}
          className="swiper-wrapper-center relative flex h-full items-center"
        >
          {messages.map(({message, link}, index) => {
            return (
              <SwiperSlide key={index} className="px-4">
                <div
                  className="px-contained flex min-h-full items-center justify-center text-center text-xs tracking-[0.04em] sm:text-sm"
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
              </SwiperSlide>
            );
          })}

          {messages.length > 1 && (
            <>
              <button
                aria-label="See previous slide"
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className="swiper-button-prev !left-4 md:!left-8 xl:!left-12"
                type="button"
              />

              <button
                aria-label="See next slide"
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className="swiper-button-next !right-4 md:!right-8 xl:!right-12"
                type="button"
              />
            </>
          )}
        </Swiper>
      ) : null}
    </div>
  );
}

Promobar.displayName = 'Promobar';
