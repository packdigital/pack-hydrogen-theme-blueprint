import {useEffect, useState} from 'react';
import {useNavigate} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';

import {Spinner} from '~/components/Animations';
import {useLocale} from '~/hooks';

/**
 * Automatically creates a new cart based on the URL.
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

export default function CartLinesRoute() {
  const {cartCreate, lines = [], status} = useCart();
  const navigate = useNavigate();
  const {pathPrefix} = useLocale();

  const [linesToAdd, setLinesToAdd] = useState<CartLineInput[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [isCartCreated, setIsCartCreated] = useState(false);
  const [isMaybeError, setIsMaybeError] = useState(false);

  useEffect(() => {
    const linesPath = window.location.pathname.split('/').pop();
    if (!linesPath) {
      navigate(`${pathPrefix}/cart`, {replace: true});
      return;
    }
    const lines = linesPath.split(',').map((line) => {
      const lineDetails = line.split(':');
      const variantId = lineDetails[0];
      const quantity = parseInt(lineDetails[1], 10) ?? 1;
      return {
        merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
        quantity,
      };
    });
    const searchParams = new URLSearchParams(window.location.search);
    const discount = searchParams.get('discount');
    if (discount) setDiscountCode(discount);
    setLinesToAdd(lines);
  }, []);

  useEffect(() => {
    if (status === 'idle' && linesToAdd.length > 0) {
      cartCreate({
        lines: linesToAdd,
        discountCodes: discountCode ? [discountCode] : [],
      });
      setLinesToAdd([]);
      setDiscountCode('');
      setIsCartCreated(true);
    }
  }, [status === 'idle', JSON.stringify(linesToAdd)]);

  useEffect(() => {
    if (isCartCreated && lines.length > 0) {
      setTimeout(() => {
        navigate(`${pathPrefix}/cart`, {replace: true});
      }, 100);
    }
  }, [isCartCreated, JSON.stringify(lines)]);

  useEffect(() => {
    setTimeout(() => {
      setIsMaybeError(true);
    }, 8000);
  }, []);

  return (
    <div
      className={`px-contained py-contained flex items-center justify-center max-md:h-[calc(100vh-var(--header-height-mobile)-var(--promobar-height-mobile))] md:h-[calc(100vh-var(--header-height-desktop)-var(--promobar-height-desktop))]`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <Spinner width="24" />
          <h1 className="font-sans text-2xl font-bold">
            Your cart is creating...
          </h1>
        </div>

        {isMaybeError && (
          <p className="text-center text-lg">
            Cart link may be expired or invalid. Try checking the URL.
          </p>
        )}
      </div>
    </div>
  );
}
