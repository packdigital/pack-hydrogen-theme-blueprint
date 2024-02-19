import {useEffect} from 'react';
import type {SwiperProps} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, EffectFade, Autoplay, Navigation} from 'swiper/modules';

import {Link} from '~/components';
import type {Settings} from '~/lib/types';

import type {UsePromobarReturn} from './usePromobar';

export function Promobar({
  promobarDisabled,
  promobarHeight,
  promobarHidden,
  setPromobarHidden,
  settings,
}: UsePromobarReturn & {
  settings: Settings['header'];
}) {
  const {promobar} = {...settings};
  const {autohide, bgColor, color, delay, effect, enabled, messages, speed} = {
    ...promobar,
  };

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
      setPromobarHidden(window.scrollY > promobarHeight);
    };

    if (!autohide) {
      setPromobarHidden(false);
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
        promobarHidden || promobarDisabled
          ? 'h-0 duration-[50ms]'
          : 'h-[var(--promobar-height)] duration-300'
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
                    className="test-link select-none"
                    draggable={false}
                    to={link.url}
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
                className="swiper-button-prev !left-4 md:!left-8 xl:!left-12"
                type="button"
              />

              <button
                aria-label="See next slide"
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
