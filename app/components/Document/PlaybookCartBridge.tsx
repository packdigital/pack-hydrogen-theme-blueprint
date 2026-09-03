import {usePlaybookCart} from '@pack/react';

import {useCart, useMenu, useRootLoaderData} from '~/hooks';

/**
 * Lets Playbook's collection-grid "Add to cart" button use THIS store's cart.
 *
 * Playbook adds a line on a Liquid theme through Shopify's AJAX Cart API. There
 * is no Hydrogen equivalent, and it deliberately will not write the line through
 * the Storefront API instead: our cart's UI renders from React state no
 * third-party script can reach, so the line would land in Shopify while the cart
 * icon still read zero and the drawer never opened. Playbook links to the
 * product page instead of looking broken. This hands it the one thing it's
 * missing — a way to ask US to do the write.
 *
 * Mounted inside CartProvider (see ContextsProvider). `PlaybookSDK` can't host
 * this: it renders in <Document>, outside every context.
 *
 * Renders nothing, and registers NOTHING on a store without Playbook: it is
 * gated on the same `PUBLIC_PLAYBOOK_SHOP_ID` that decides whether the SDK
 * loads at all, so a theme that ships this but never sets the env var is
 * provably inert rather than merely unused.
 */
export function PlaybookCartBridge() {
  const {ENV} = useRootLoaderData();
  const {linesAdd} = useCart();
  const {openCart} = useMenu();

  const enabled = Boolean(ENV?.PUBLIC_PLAYBOOK_SHOP_ID);

  usePlaybookCart(
    !enabled
      ? null
      : async ({variantId, quantity, sellingPlanId, attributes}) => {
          const data = await linesAdd([
            {
              merchandiseId: variantId,
              quantity,
              ...(sellingPlanId
                ? {sellingPlanId: sellingPlanId as string}
                : {}),
              ...(Array.isArray(attributes) ? {attributes} : {}),
            },
          ]);

          // `linesAdd` DOES NOT THROW. A failed request resolves to `null`, and a
          // rejected line resolves with `userErrors` populated — which is why
          // useAddToCart inspects the payload rather than using try/catch. Playbook's
          // contract is the opposite (resolve = added), so without this the shopper
          // would see "Added" for a line that never landed.
          if (!data)
            throw new Error('Playbook add-to-cart: cart request failed');
          if (data.userErrors?.length) {
            throw new Error(
              data.userErrors[0]?.message ?? 'Playbook add-to-cart: rejected',
            );
          }

          // The drawer opening is the whole point. A silent, correct write is the
          // exact experience this bridge exists to avoid — the shopper needs to see
          // that their click did something.
          openCart();
        },
  );

  return null;
}
