import {useMemo} from 'react';
import {useMatches} from '@remix-run/react';
import type {Customer} from '@shopify/hydrogen/storefront-api-types';

import {useGlobal} from '~/hooks';

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
  const {previewModeCustomer} = useGlobal();
  const customerFromRoot = (root?.data as RootLoaderData)?.customer;
  const customerFromAccount = (account?.data as {customer: Customer})?.customer;
  const isPreviewModeEnabled = (root?.data as RootLoaderData)
    ?.isPreviewModeEnabled;

  return useMemo(() => {
    return isPreviewModeEnabled
      ? previewModeCustomer // while in customizer, customer only exists via previewModeCustomer
      : customerFromAccount || customerFromRoot || null;
  }, [customerFromRoot, customerFromAccount, previewModeCustomer]);
}
