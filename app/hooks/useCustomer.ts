import {useMemo} from 'react';
import {useMatches} from 'react-router';
import type {Customer} from '@shopify/hydrogen/customer-account-api-types';

import type {RootLoaderData} from './useRootLoaderData';

/**
 * Get the customer object
 * @returns customer
 * @example
 * ```js
 * const customer = useCustomer();
 * ```
 */

export function useCustomer(): Customer | null | undefined {
  const [root, account] = useMatches();
  const customerFromRoot = (root?.loaderData as RootLoaderData)?.customer;
  const customerFromAccount = (account?.loaderData as {customer: Customer})
    ?.customer;

  return useMemo(() => {
    return customerFromAccount || customerFromRoot || null;
  }, [customerFromRoot, customerFromAccount]);
}
