import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {CUSTOMER_LOCATIONS_QUERY} from '~/data/graphql/customer-account/customer';

export async function action({context, request}: ActionFunctionArgs) {
  const {customerAccount} = context;
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const companyLocationId = String(body?.get('companyLocationId') || '');
  if (!companyLocationId)
    return Response.json({
      success: false,
      error: '`companyLocationId` is required.',
    });

  customerAccount.UNSTABLE_setBuyer({
    companyLocationId,
  });
  return Response.json({success: true});
}

export async function loader({context}: LoaderFunctionArgs) {
  const {customerAccount} = context;

  const buyer = await customerAccount.getBuyer();

  let companyLocationId = buyer?.companyLocationId || null;
  let company = null;

  // Check if logged in customer is a b2b customer
  if (buyer) {
    const customer = await customerAccount.query(CUSTOMER_LOCATIONS_QUERY);
    company =
      customer?.data?.customer?.companyContacts?.edges?.[0]?.node?.company ||
      null;
  }

  // If there is only 1 company location, set it in session
  if (!companyLocationId && company?.locations?.edges?.length === 1) {
    companyLocationId = company.locations.edges[0].node.id;

    customerAccount.UNSTABLE_setBuyer({
      companyLocationId,
    });
  }

  return Response.json({company, companyLocationId});
}
