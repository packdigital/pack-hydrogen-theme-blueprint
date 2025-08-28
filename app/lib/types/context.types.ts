import type {Settings} from '~/lib/types';

export type Action = {type: string; payload?: any};

export type Dispatch = ({type, payload}: Action) => void;

export type Modal = {
  children: React.ReactNode | null;
  props?: Record<string, any>;
  disableClose?: boolean;
};

/*
 * MENU CONTEXT PROVIDER -----------------------------------------------------
 */

export interface MenuState {
  cartOpen: boolean;
  desktopMenuOpen: boolean;
  iframesHidden: boolean;
  mobileMenuOpen: boolean;
  modal: Modal;
  searchOpen: boolean;
}

export interface MenuActions {
  openCart: () => void;
  closeCart: () => void;
  openDesktopMenu: () => void;
  closeDesktopMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openModal: (
    children: React.ReactNode,
    props?: Record<string, any>,
    disableClose?: boolean,
  ) => void;
  closeModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  closeAll: () => void;
  toggleIframesHidden: (isHidden: boolean) => void;
}

export interface MenuContext {
  state: MenuState;
  actions: MenuActions;
}

/*
 * PROMOBAR CONTEXT PROVIDER -----------------------------------------------------
 */

export interface PromobarState {
  promobarOpen: boolean;
}

export interface PromobarActions {
  togglePromobar: (isOpen: boolean) => void;
}

export interface PromobarContext {
  state: PromobarState;
  actions: PromobarActions;
}

/*
 * SETTINGS CONTEXT PROVIDER -----------------------------------------------------
 */

export interface SettingsState {
  settings: Settings;
  isTransparentNavPage: boolean;
}

export interface SettingsActions {}

export interface SettingsContext {
  state: SettingsState;
  actions: SettingsActions;
}

/*
 * GLOBAL CONTEXT PROVIDER -----------------------------------------------------
 */

export interface GlobalState {
  isCartReady: boolean;
  isBot: boolean;
}

export interface GlobalActions {
  setIsCartReady: (isReady: boolean) => void;
  setIsBot: (isBot: boolean) => void;
}

export interface GlobalContext {
  state: GlobalState;
  actions: GlobalActions;
}
