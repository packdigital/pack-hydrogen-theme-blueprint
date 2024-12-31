import {createContext, useContext} from 'react';

import type {MenuContext} from '~/lib/types';

export const Context = createContext({state: {}, actions: {}} as MenuContext);

export const useMenuContext = () => useContext(Context);
