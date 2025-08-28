import type {AppLoadContext} from '@shopify/remix-oxygen';

/* Buyer contextualization for B2B */
export const getBuyerVariables = async (context: AppLoadContext) => {
  const {customerAccount} = context;
  const buyer = await customerAccount.getBuyer();
  return buyer?.companyLocationId && buyer?.customerAccessToken
    ? {
        buyer: {
          companyLocationId: buyer.companyLocationId,
          customerAccessToken: buyer.customerAccessToken,
        },
      }
    : null;
};
