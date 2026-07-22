import type {Cart} from '@shopify/hydrogen/storefront-api-types';

import type {Settings} from '~/lib/types';

export type Action = {type: string; payload?: any};

export type Dispatch = ({type, payload}: Action) => void;

export type Modal = {
  children: React.ReactNode | null;
  props?: Record<string, any>;
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
  openModal: (children: React.ReactNode, props?: Record<string, any>) => void;
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
 * CART CONTEXT PROVIDER -----------------------------------------------------
 */

export type CartStatus =
  'uninitialized' | 'creating' | 'fetching' | 'updating' | 'idle';

export type CartError = unknown;

/**
 * Transient, client-only overlay of optimistic cart line quantities keyed by
 * cart line id. Each entry carries a monotonically increasing `seq` so a stale
 * in-flight server response can't clobber a newer optimistic value during
 * reconciliation. This is purely a visual layer — the server cart is always the
 * source of truth and these entries are dropped on reconcile.
 */
export interface OptimisticLine {
  quantity: number;
  seq: number;
}

export type OptimisticLines = Record<string, OptimisticLine>;

export interface CartState {
  cart: Cart | null;
  status: CartStatus;
  error: CartError;
  optimisticLines: OptimisticLines;
}

export interface CartActions {
  setCart: (cart: Cart) => void;
  setStatus: (status: CartState['status']) => void;
  setError: (error: unknown) => void;
  setOptimisticLine: (lineId: string, quantity: number, seq: number) => void;
  /**
   * Drop optimistic overlay entries that have been reconciled against the
   * server cart. Only clears an entry when its current seq matches the seq that
   * was flushed (`flushedSeqs`), preserving newer clicks made mid-flight.
   */
  reconcileOptimisticLines: (flushedSeqs: Record<string, number>) => void;
}

export interface CartContext {
  state: CartState;
  actions: CartActions;
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
