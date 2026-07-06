import {redirect} from 'react-router';

import type {Route} from './+types/($locale).cart.$lines';

/**
 * Automatically creates a new cart based on the URL and redirects straight to checkout.
 * Expected URL structure:
 * ```ts
 * /cart/<variant_id>:<quantity>
 *
 * ```
 * More than one `<variant_id>:<quantity>` separated by a comma, can be supplied in the URL, for
 * carts with more than one product variant.
 *
 * @param `?discount` an optional discount code to apply to the cart
 * @example
 * Example path creating a cart with two product variants, different quantities, and a discount code:
 * ```ts
 * /cart/41007289663544:1,41007289696312:2?discount=HYDROBOARD
 *
 * ```
 * @preserve
 */

/**
 * Playbook (heyplaybook.com) A/B testing attribution.
 * The Playbook SDK sets cookies when a visitor lands on a Playbook experience:
 * `_pb_impression_id` + `_pb_variant`, plus either `_pb_test_id` (tests) or
 * `_pb_experiment_id` + `_pb_arm_id` (experiments). These need to be carried
 * through to the Shopify order as cart attributes so the orders/paid webhook
 * can attribute the purchase back to the correct variant.
 *
 * This route creates a brand-new cart server-side from a URL, so the SDK's
 * client-side cart injection never runs. We read the cookies and inject them
 * manually after cart creation.
 */
function getCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getPlaybookCartAttributes(
  request: Request,
): Array<{key: string; value: string}> {
  const impressionId = getCookie(request, '_pb_impression_id');
  const variant = getCookie(request, '_pb_variant');
  if (!impressionId || !variant) return [];

  const attributes = [
    {key: 'pb_impression_id__', value: impressionId},
    {key: 'pb_variant__', value: variant},
  ];

  const testId = getCookie(request, '_pb_test_id');
  if (testId) attributes.push({key: 'pb_test_id__', value: testId});

  const experimentId = getCookie(request, '_pb_experiment_id');
  const armId = getCookie(request, '_pb_arm_id');
  if (experimentId && armId) {
    attributes.push(
      {key: 'pb_experiment_id__', value: experimentId},
      {key: 'pb_arm_id__', value: armId},
    );
  }

  return attributes;
}

export async function loader({request, context, params}: Route.LoaderArgs) {
  const {cart} = context;
  const {lines} = params;
  const linesMap = lines?.split(',').map((line) => {
    const lineDetails = line.split(':');
    const variantId = lineDetails[0];
    const quantity = parseInt(lineDetails[1], 10);

    return {
      merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
      quantity,
    };
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const discount = searchParams.get('discount');
  const discountArray = discount ? [discount] : [];

  // Playbook attribution — read cookies set by the Playbook SDK
  const playbookAttributes = getPlaybookCartAttributes(request);

  // Create a cart
  const result = await cart.create({
    lines: linesMap,
    discountCodes: discountArray,
  });

  const cartResult = result.cart;

  if (result.errors?.length || !cartResult) {
    throw new Response('Link may be expired. Try checking the URL.', {
      status: 410,
    });
  }

  // Playbook attribution — inject into the new cart as private attributes
  // (double-underscore suffix hides them from customers but persists to the
  // Shopify order's note_attributes, where our webhook picks them up)
  if (playbookAttributes.length) {
    await cart.updateAttributes(playbookAttributes);
  }

  // Update cart id in cookie
  const headers = cart.setCartId(cartResult.id);

  // Redirect to checkout
  if (cartResult.checkoutUrl) {
    return redirect(cartResult.checkoutUrl, {headers});
  } else {
    throw new Error('No checkout URL found');
  }
}

export default function Component() {
  return null;
}
