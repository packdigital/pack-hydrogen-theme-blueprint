import {useEffect, useMemo, useReducer} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {load} from '@fingerprintjs/botd';
import type {ReactNode} from 'react';

import type {Action, Dispatch, GlobalState} from '~/lib/types';

import {Context} from './useGlobalContext';

const botdPromise = load();

const globalState = {
  isCartReady: false,
  isBot: false,
};

const reducer = (state: GlobalState, action: Action) => {
  switch (action.type) {
    case 'SET_IS_CART_READY':
      return {
        ...state,
        isCartReady: action.payload,
      };
    case 'SET_IS_BOT':
      return {
        ...state,
        isBot: action.payload,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  setIsCartReady: (isReady: boolean) => {
    dispatch({type: 'SET_IS_CART_READY', payload: isReady});
  },
  setIsBot: (isBot: boolean) => {
    dispatch({type: 'SET_IS_BOT', payload: isBot});
  },
});

export function GlobalProvider({children}: {children: ReactNode}) {
  const {cartCreate, status} = useCart();
  const cartIsIdle = status === 'idle';
  const [state, dispatch] = useReducer(reducer, {
    ...globalState,
    isCartReady: cartIsIdle,
  });

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  useEffect(() => {
    window.__pack_cart_status = status;
  }, [status]);

  useEffect(() => {
    if (cartIsIdle) {
      value.actions.setIsCartReady(true);
      window.__pack_is_cart_ready = true;
    } else {
      // uninitialized cart never becomes idle so instead create empty cart after 1 sec
      setTimeout(() => {
        if (
          window.__pack_is_cart_ready ||
          window.__pack_cart_status !== 'uninitialized'
        )
          return;
        cartCreate({lines: []});
      }, 1000);
    }
  }, [cartIsIdle]);

  useEffect(() => {
    botdPromise
      .then((botd) => botd.detect())
      .then((result) => value.actions.setIsBot(result.bot));
  }, [botdPromise]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
