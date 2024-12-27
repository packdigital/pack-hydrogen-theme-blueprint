import {useMemo, useReducer} from 'react';
import type {ReactNode} from 'react';

import type {Action, Dispatch, PromobarState} from '~/lib/types';

import {Context} from './usePromobarContext';

const promobarState = {
  promobarOpen: true,
};

const reducer = (state: PromobarState, action: Action) => {
  switch (action.type) {
    case 'TOGGLE_PROMOBAR':
      return {
        ...state,
        promobarOpen: action.payload,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  togglePromobar: (isOpen: boolean) => {
    dispatch({type: 'TOGGLE_PROMOBAR', payload: isOpen});
  },
});

export function PromobarProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(reducer, promobarState);

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
