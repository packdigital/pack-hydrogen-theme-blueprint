import {createContext, useContext} from 'react';

export const Context = createContext({state: {}, actions: {}});

export const useCollectionFiltersContext = () => useContext(Context);
