import {createContext, useContext} from 'react';

import type {GroupingsContext} from '~/lib/types';

export const Context = createContext({
  state: {},
  actions: {},
} as GroupingsContext);

export const useGroupingsContext = () => useContext(Context);
