import {useEffect, useMemo, useReducer} from 'react';
import type {ReactNode} from 'react';
import type {Cart} from '@shopify/hydrogen/storefront-api-types';

import type {Action, CartState, Dispatch} from '~/lib/types';
import {useRootLoaderData} from '~/hooks';

import {Context} from './useCartContext';

const cartState = {
  cart: null,
  status: 'uninitialized',
  error: null,
};

const reducer = (state: CartState, action: Action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  setCart: (cart: Cart) => dispatch({type: 'SET_CART', payload: cart}),
  setStatus: (status: CartState['status']) =>
    dispatch({type: 'SET_STATUS', payload: status}),
  setError: (error: unknown) => dispatch({type: 'SET_ERROR', payload: error}),
});

export function CartProvider({children}: {children: ReactNode}) {
  const {cart} = useRootLoaderData();

  const [state, dispatch] = useReducer(reducer, cartState);

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  /*
   * Fetch cart on initial load and set in context
   */
  useEffect(() => {
    if (value.state.status !== 'uninitialized') return;
    const setCart = async () => {
      value.actions.setError(null);
      const cartData = await (cart as Promise<Cart>);
      value.actions.setCart(cartData);
      if (cartData) value.actions.setStatus('idle');
    };
    setCart();
  }, [cart, value.state.status === 'uninitialized']);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
