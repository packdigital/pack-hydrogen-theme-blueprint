import {useEffect, useMemo, useReducer, useState} from 'react';
import type {ReactNode} from 'react';

import type {Action, Dispatch, MenuState} from '~/lib/types';

import {Context} from './useMenuContext';

const defaultModal = {children: null, props: {}};

const globalState = {
  cartOpen: false,
  desktopMenuOpen: false,
  iframesHidden: false,
  mobileMenuOpen: false,
  modal: defaultModal,
  searchOpen: false,
};

const reducer = (state: MenuState, action: Action) => {
  switch (action.type) {
    case 'OPEN_CART':
      return {
        ...state,
        cartOpen: true,
        desktopMenuOpen: false,
        mobileMenuOpen: false,
        modal: defaultModal,
        searchOpen: false,
      };
    case 'CLOSE_CART':
      return {
        ...state,
        cartOpen: false,
      };
    case 'OPEN_DESKTOP_MENU':
      return {
        ...state,
        cartOpen: false,
        desktopMenuOpen: true,
        mobileMenuOpen: false,
        modal: defaultModal,
        searchOpen: false,
      };
    case 'CLOSE_DESKTOP_MENU':
      return {
        ...state,
        desktopMenuOpen: false,
      };
    case 'OPEN_MOBILE_MENU':
      return {
        ...state,
        cartOpen: false,
        desktopMenuOpen: false,
        mobileMenuOpen: true,
        modal: defaultModal,
        searchOpen: false,
      };
    case 'CLOSE_MOBILE_MENU':
      return {
        ...state,
        mobileMenuOpen: false,
      };
    case 'OPEN_MODAL':
      return {
        ...state,
        cartOpen: false,
        desktopMenuOpen: false,
        mobileMenuOpen: false,
        modal: {
          children: action.payload.children,
          props: {...action.payload.props},
        },
        searchOpen: false,
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: defaultModal,
      };
    case 'OPEN_SEARCH':
      return {
        ...state,
        cartOpen: false,
        desktopMenuOpen: false,
        mobileMenuOpen: false,
        modal: defaultModal,
        searchOpen: true,
      };
    case 'CLOSE_SEARCH':
      return {
        ...state,
        searchOpen: false,
      };
    case 'CLOSE_ALL':
      return {
        ...state,
        cartOpen: false,
        desktopMenuOpen: false,
        mobileMenuOpen: false,
        modal: defaultModal,
        searchOpen: false,
      };
    case 'TOGGLE_IFRAMES_HIDDEN':
      return {
        ...state,
        iframesHidden: action.payload,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  openCart: () => {
    dispatch({type: 'OPEN_CART'});
  },
  closeCart: () => {
    dispatch({type: 'CLOSE_CART'});
  },
  openDesktopMenu: () => {
    dispatch({type: 'OPEN_DESKTOP_MENU'});
  },
  closeDesktopMenu: () => {
    dispatch({type: 'CLOSE_DESKTOP_MENU'});
  },
  openMobileMenu: () => {
    dispatch({type: 'OPEN_MOBILE_MENU'});
  },
  closeMobileMenu: () => {
    dispatch({type: 'CLOSE_MOBILE_MENU'});
  },
  openModal: (children: ReactNode, props?: Record<string, any>) => {
    dispatch({type: 'OPEN_MODAL', payload: {children, props}});
  },
  closeModal: () => {
    dispatch({type: 'CLOSE_MODAL'});
  },
  openSearch: () => {
    dispatch({type: 'OPEN_SEARCH'});
  },
  closeSearch: () => {
    dispatch({type: 'CLOSE_SEARCH'});
  },
  closeAll: () => {
    dispatch({type: 'CLOSE_ALL'});
  },
  toggleIframesHidden: (isHidden: boolean) => {
    dispatch({type: 'TOGGLE_IFRAMES_HIDDEN', payload: isHidden});
  },
});

export function MenuProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(reducer, globalState);

  const [isReady, setIsReady] = useState(false);

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  const iframesShouldBeHidden = state.iframesHidden || state.mobileMenuOpen;

  useEffect(() => {
    if (iframesShouldBeHidden && !isReady) setIsReady(true);
  }, [iframesShouldBeHidden]);

  useEffect(() => {
    if (!isReady) return;
    const iframes = document.querySelectorAll('iframe');
    if (iframesShouldBeHidden) {
      [...(iframes || [])].forEach((iframe) => {
        iframe.classList.add('!invisible');
      });
    } else {
      [...(iframes || [])].forEach((iframe) => {
        iframe.classList.remove('!invisible');
      });
    }
  }, [iframesShouldBeHidden, isReady]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
