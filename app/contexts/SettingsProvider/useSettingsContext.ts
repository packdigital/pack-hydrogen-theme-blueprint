import {createContext, useContext} from 'react';

import type {SettingsContext} from '~/lib/types';

export const Context = createContext({
  state: {},
  actions: {},
} as SettingsContext);

export const useSettingsContext = () => useContext(Context);
