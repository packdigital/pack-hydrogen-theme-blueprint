import {useMemo} from 'react';
import {useMatches} from '@remix-run/react';
import type {Customer} from '@shopify/hydrogen/storefront-api-types';

import type {RootLoaderData} from './useRootLoaderData';

/**
 * Get the customer object
 * @returns customer
 * @example
 * ```js
 * const customer = useCustomer();
 * ```
 */

export function useCustomer(): Customer | null {
  const [root, account] = useMatches();
  const customerFromRoot = (root?.data as RootLoaderData)?.customer;
  const customerFromAccount = (account?.data as {customer: Customer})?.customer;

  return useMemo(() => {
    return customerFromAccount || customerFromRoot || null;
  }, [customerFromRoot, customerFromAccount]);
}
