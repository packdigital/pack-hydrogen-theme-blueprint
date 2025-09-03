import {redirect} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import type {Order as OrderType} from '@shopify/hydrogen/customer-account-api-types';

import {getAccountSeo} from '~/lib/server-utils/seo.server';
import {CustomerAccountLayout} from '~/components/AccountLayout/CustomerAccountLayout';
import {Order} from '~/components/Account/Order/Order';
import {CUSTOMER_ORDER_QUERY} from '~/data/graphql/customer-account/customer';

export async function loader({request, context, params}: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect(params?.locale ? `${params.locale}/account` : '/account');
  }
  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get('key');

  try {
    const orderId = orderToken
      ? `gid://shopify/Order/${params.id}?key=${orderToken}`
      : `gid://shopify/Order/${params.id}`;

    const {data, errors} = await context.customerAccount.query(
      CUSTOMER_ORDER_QUERY,
      {variables: {orderId}},
    );

    if (errors?.length || !data?.order || !data?.order?.lineItems) {
      throw new Error('order information');
    }

    const order: OrderType = data.order;

    const analytics = {pageType: AnalyticsPageType.customersOrder};
    const seo = await getAccountSeo(context, 'Order');

    return {analytics, order, seo};
  } catch (error) {
    throw new Response(error instanceof Error ? error.message : undefined, {
      status: 404,
    });
  }
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function OrderRoute() {
  return (
    <CustomerAccountLayout>
      <Order />
    </CustomerAccountLayout>
  );
}

OrderRoute.displayName = 'OrderRoute';
