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
  optimisticLines: {},
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
    case 'SET_OPTIMISTIC_LINE': {
      const {lineId, quantity, seq} = action.payload;
      return {
        ...state,
        optimisticLines: {
          ...state.optimisticLines,
          [lineId]: {quantity, seq},
        },
      };
    }
    case 'RECONCILE_OPTIMISTIC_LINES': {
      const flushedSeqs: Record<string, number> = action.payload;
      const next = {...state.optimisticLines};
      let changed = false;
      Object.entries(flushedSeqs).forEach(([lineId, seq]) => {
        // Only clear if the overlay hasn't advanced past the flushed seq —
        // a newer click made mid-flight must survive reconciliation.
        if (next[lineId] && next[lineId].seq === seq) {
          delete next[lineId];
          changed = true;
        }
      });
      if (!changed) return state;
      return {...state, optimisticLines: next};
    }
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  setCart: (cart: Cart) => dispatch({type: 'SET_CART', payload: cart}),
  setStatus: (status: CartState['status']) =>
    dispatch({type: 'SET_STATUS', payload: status}),
  setError: (error: unknown) => dispatch({type: 'SET_ERROR', payload: error}),
  setOptimisticLine: (lineId: string, quantity: number, seq: number) =>
    dispatch({
      type: 'SET_OPTIMISTIC_LINE',
      payload: {lineId, quantity, seq},
    }),
  reconcileOptimisticLines: (flushedSeqs: Record<string, number>) =>
    dispatch({type: 'RECONCILE_OPTIMISTIC_LINES', payload: flushedSeqs}),
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
