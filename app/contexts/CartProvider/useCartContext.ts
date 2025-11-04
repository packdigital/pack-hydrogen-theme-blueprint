import {createContext, useContext} from 'react';

import type {CartContext} from '~/lib/types';

export const Context = createContext({
  state: {},
  actions: {},
} as CartContext);

export const useCartContext = () => useContext(Context);
