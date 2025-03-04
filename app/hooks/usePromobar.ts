import {PROMOBAR_HEIGHT_MOBILE, PROMOBAR_HEIGHT_DESKTOP} from '~/lib/constants';
import {usePromobarContext} from '~/contexts/PromobarProvider/usePromobarContext';
import {useSettingsContext} from '~/contexts/SettingsProvider/useSettingsContext';
import {useSettings} from '~/hooks';

export interface UsePromobarReturn {
  headerMobileHeightClass: string;
  headerDesktopHeightClass: string;
  headerHeightClass: string;
  isTransparentNavPage: boolean;
  mainPaddingTopClass: string;
  menuMobileHeightClass: string;
  menuDesktopHeightClass: string;
  menuHeightClass: string;
  promobarDisabled: boolean;
  promobarHeightMobile: number;
  promobarHeightDesktop: number;
  promobarOpen: boolean;
  togglePromobar: (state: boolean) => void;
}

export function usePromobar(): UsePromobarReturn {
  const {
    state: {promobarOpen},
    actions: {togglePromobar},
  } = usePromobarContext();
  const {
    state: {isTransparentNavPage},
  } = useSettingsContext();
  const {header} = useSettings();
  const {promobar} = {...header};

  const promobarDisabled =
    isTransparentNavPage ||
    (!!promobar && (!promobar.enabled || !promobar.messages?.length));

  const headerMobileHeightClass =
    promobarOpen && !promobarDisabled
      ? 'max-md:h-[calc(var(--header-height-mobile)+var(--promobar-height-mobile))]'
      : 'max-md:h-[var(--header-height-mobile)]';
  const headerDesktopHeightClass =
    promobarOpen && !promobarDisabled
      ? 'md:h-[calc(var(--header-height-desktop)+var(--promobar-height-desktop))]'
      : 'md:h-[var(--header-height-desktop)]';
  const headerHeightClass = `${headerMobileHeightClass} ${headerDesktopHeightClass}`;

  const menuMobileHeightClass =
    promobarOpen && !promobarDisabled
      ? 'max-md:h-[calc(var(--viewport-height)-var(--header-height-mobile)-var(--promobar-height-mobile))]'
      : 'max-md:h-[calc(var(--viewport-height)-var(--header-height-mobile))]';
  const menuDesktopHeightClass =
    promobarOpen && !promobarDisabled
      ? 'md:h-[calc(var(--viewport-height)-var(--header-height-desktop)-var(--promobar-height-desktop))]'
      : 'md:h-[calc(var(--viewport-height)-var(--header-height-desktop))]';
  const menuHeightClass = `${menuMobileHeightClass} ${menuDesktopHeightClass}`;
  const mainPaddingTopClass = !isTransparentNavPage
    ? promobarDisabled
      ? 'max-md:pt-[var(--header-height-mobile)] md:pt-[var(--header-height-desktop)]'
      : 'max-md:pt-[calc(var(--header-height-mobile)+var(--promobar-height-mobile))] md:pt-[calc(var(--header-height-desktop)+var(--promobar-height-desktop))]'
    : '';

  return {
    headerMobileHeightClass,
    headerDesktopHeightClass,
    headerHeightClass,
    isTransparentNavPage,
    mainPaddingTopClass,
    menuMobileHeightClass,
    menuDesktopHeightClass,
    menuHeightClass,
    promobarDisabled,
    promobarHeightMobile: PROMOBAR_HEIGHT_MOBILE,
    promobarHeightDesktop: PROMOBAR_HEIGHT_DESKTOP,
    promobarOpen,
    togglePromobar,
  };
}
