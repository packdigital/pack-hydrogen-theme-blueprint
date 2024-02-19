import {useCallback, useEffect, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import {useSiteSettings} from '@pack/react';
import type {
  AttributeInput,
  ProductVariant,
  SellingPlan,
} from '@shopify/hydrogen/storefront-api-types';

import type {SiteSettings} from '~/lib/types';
import {useGlobal} from '~/hooks';

/**
 * Add to cart hook
 * @param addToCartTextOverride - Add to cart button text override
 * @param attributes - Array of attributes
 * @param quantity - Quantity
 * @param selectedVariant - Selected variant
 * @param sellingPlanId - Selling plan id
 * @returns Add to cart hook return
 * @example
 * ```tsx
 * const {buttonText, cartIsUpdating, handleAddToCart, isAdded, isAdding, isSoldOut, subtext} = useAddToCart({
 *   addToCartText: 'Add to cart!',
 *   attributes: [{name: 'Color', value: 'Red'}],
 *   quantity: 1,
 *   selectedVariant: product.variants[0],
 * });
 * ```
 */

interface UseAddToCartProps {
  addToCartText?: string;
  attributes?: AttributeInput[];
  quantity?: number;
  selectedVariant?: ProductVariant | null;
  sellingPlanId?: SellingPlan['id'];
}

interface UseAddToCartReturn {
  buttonText: string;
  cartIsUpdating: boolean;
  handleAddToCart: () => void;
  handleNotifyMe: (component: React.ReactNode) => void;
  isAdded: boolean;
  isAdding: boolean;
  isNotifyMe: boolean;
  isSoldOut: boolean;
  subtext: string;
}

export function useAddToCart({
  addToCartText: addToCartTextOverride = '',
  attributes,
  quantity = 1,
  selectedVariant = null,
  sellingPlanId,
}: UseAddToCartProps): UseAddToCartReturn {
  const {error, linesAdd, status} = useCart();
  const siteSettings = useSiteSettings() as SiteSettings;
  const {openCart, openModal} = useGlobal();

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const enabledNotifyMe = siteSettings?.settings?.product?.backInStock?.enabled;
  const variantIsSoldOut = selectedVariant && !selectedVariant.availableForSale;
  const variantIsPreorder = !!selectedVariant?.currentlyNotInStock;

  let buttonText = '';
  if (variantIsPreorder) {
    buttonText =
      siteSettings?.settings?.product?.addToCart?.preorderText || 'Preorder';
  } else if (variantIsSoldOut) {
    buttonText = enabledNotifyMe
      ? siteSettings?.settings?.product?.backInStock?.notifyMeText ||
        'Notify Me'
      : siteSettings?.settings?.product?.addToCart?.soldOutText || 'Sold Out';
  } else {
    buttonText =
      addToCartTextOverride ||
      siteSettings?.settings?.product?.addToCart?.addToCartText ||
      'Add To Cart';
  }

  const cartIsUpdating = status === 'creating' || status === 'updating';

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant?.id || isAdding || cartIsUpdating) return;
    setIsAdding(true);
    linesAdd([
      {
        attributes,
        merchandiseId: selectedVariant.id,
        quantity,
        sellingPlanId,
      },
    ]);
  }, [
    attributes,
    isAdding,
    linesAdd,
    quantity,
    selectedVariant?.id,
    sellingPlanId,
    status,
  ]);

  const handleNotifyMe = useCallback(
    (component: React.ReactNode) => {
      if (!selectedVariant?.id) return;
      openModal(component);
    },
    [selectedVariant?.id],
  );

  useEffect(() => {
    if (isAdding && status === 'idle') {
      setIsAdding(false);
      setIsAdded(true);
      openCart();
      setTimeout(() => setIsAdded(false), 1000);
    }
  }, [status, isAdding]);

  useEffect(() => {
    if (!error) return;
    console.error('@shopify/hydrogen-react:useCart', error);
  }, [error]);

  return {
    buttonText,
    cartIsUpdating, // cart is updating
    handleAddToCart,
    handleNotifyMe,
    isAdded, // line is added (true for only a second)
    isAdding, // line is adding
    isNotifyMe: !!variantIsSoldOut && enabledNotifyMe,
    isSoldOut: !!variantIsSoldOut,
    subtext: siteSettings?.settings?.product?.addToCart?.subtext,
  };
}
