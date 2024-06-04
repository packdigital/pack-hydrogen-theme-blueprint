import type {Customer} from '@shopify/hydrogen-react/storefront-api-types';

import type {Settings} from '~/lib/types';

export type Action = {type: string; payload?: any};

export type Dispatch = ({type, payload}: Action) => void;

export type Modal = {
  children: React.ReactNode | null;
  props?: Record<string, any>;
};

export interface GlobalState {
  cartOpen: boolean;
  desktopMenuOpen: boolean;
  iframesHidden: boolean;
  mobileMenuOpen: boolean;
  modal: Modal;
  promobarOpen: boolean;
  searchOpen: boolean;
  settings: Settings;
  emitter: any;
  previewModeCustomer: Customer | null | undefined;
  isPreviewModeEnabled: boolean;
}

export interface GlobalActions {
  openCart: () => void;
  closeCart: () => void;
  openDesktopMenu: () => void;
  closeDesktopMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openModal: (children: React.ReactNode, props?: Record<string, any>) => void;
  closeModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  togglePromobar: (isOpen: boolean) => void;
  toggleIframesHidden: (isHidden: boolean) => void;
  closeAll: () => void;
  setPreviewModeCustomer: (customer: Customer | null) => void;
}

export interface GlobalContext {
  state: GlobalState;
  actions: GlobalActions;
}
