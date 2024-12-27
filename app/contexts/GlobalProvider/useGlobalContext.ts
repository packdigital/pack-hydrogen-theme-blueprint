import {createContext, useContext} from 'react';

import type {GlobalContext} from '~/lib/types';

export const Context = createContext({state: {}, actions: {}} as GlobalContext);

export const useGlobalContext = () => useContext(Context);
