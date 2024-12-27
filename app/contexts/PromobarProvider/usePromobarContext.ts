import {createContext, useContext} from 'react';

import type {PromobarContext} from '~/lib/types';

export const Context = createContext({
  state: {},
  actions: {},
} as PromobarContext);

export const usePromobarContext = () => useContext(Context);
