import {useEffect, useMemo, useReducer} from 'react';
import type {ReactNode} from 'react';

import {useCart} from '~/hooks';
import type {Action, Dispatch, GlobalState} from '~/lib/types';

import {Context} from './useGlobalContext';

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
    // Bot detection isn't above-the-fold; load @fingerprintjs/botd lazily so
    // it stays off the critical path / out of the entry chunk.
    let active = true;
    import('@fingerprintjs/botd')
      .then(({load}) => load())
      .then((botd) => botd.detect())
      .then((result) => {
        if (active) value.actions.setIsBot(result.bot);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
