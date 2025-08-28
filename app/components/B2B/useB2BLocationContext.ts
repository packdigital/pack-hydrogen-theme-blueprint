import {createContext, useContext} from 'react';

import type {B2BLocationContextValue} from '~/lib/types';

export const defaultB2BLocationContextValue = {
  company: undefined,
  companyLocationId: undefined,
};

export const B2BLocationContext = createContext<B2BLocationContextValue>(
  defaultB2BLocationContextValue,
);

export function useB2BLocationContext(): B2BLocationContextValue {
  return useContext(B2BLocationContext);
}
