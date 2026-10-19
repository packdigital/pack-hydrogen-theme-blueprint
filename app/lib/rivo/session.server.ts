import type {AppLoadContext} from 'react-router';

import {CUSTOMER_ID_QUERY} from '~/data/graphql/customer-account/customer';

import {toRivoCustomerId} from './rivo-client';

/**
 * Resolve the Rivo customer id from the authenticated server session.
 *
 * The customer id is deliberately **never** accepted from the request — Rivo's
 * customer-scoped endpoints are shop-scoped rather than customer-scoped, so a
 * client-supplied id would let anyone read or spend another customer's points.
 */
export const getRivoCustomerIdFromSession = async (
  context: AppLoadContext,
): Promise<{customerId: string | null; error: string | null}> => {
  const {customerAccount} = context;

  if (!(await customerAccount.isLoggedIn())) {
    return {customerId: null, error: 'Customer is not logged in.'};
  }

  const {data, errors} = await customerAccount.query(CUSTOMER_ID_QUERY);

  if (errors?.length || !data?.customer?.id) {
    return {
      customerId: null,
      error:
        errors?.map((error: {message: string}) => error.message).join(', ') ||
        'Unable to resolve the customer from the session.',
    };
  }

  const customerId = toRivoCustomerId(data.customer.id);

  if (!customerId) {
    return {
      customerId: null,
      error: `Unexpected customer id format: ${data.customer.id}`,
    };
  }

  return {customerId, error: null};
};
