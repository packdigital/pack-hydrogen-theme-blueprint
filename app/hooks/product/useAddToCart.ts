import {useCallback, useEffect, useState} from 'react';
import type {
  AttributeInput,
  ProductVariant,
  SellingPlan,
} from '@shopify/hydrogen/storefront-api-types';

import {useCart, useMenu, useRootLoaderData, useSettings} from '~/hooks';

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
  failed: boolean;
  handleAddToCart: () => void;
  handleNotifyMe: (component: React.ReactNode) => void;
  isAdded: boolean;
  isAdding: boolean;
  isNotifyMe: boolean;
  isPreorder: boolean;
  isSoldOut: boolean;
  preOrderShippingText: string;
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
  const {isPreviewModeEnabled} = useRootLoaderData();
  const {product: productSettings} = useSettings();
  const {openCart, openModal} = useMenu();

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [failed, setFailed] = useState(false);

  const enabledNotifyMe = productSettings?.backInStock?.enabled ?? true;
  const variantIsSoldOut = selectedVariant && !selectedVariant.availableForSale;
  const variantIsPreorder = !!selectedVariant?.currentlyNotInStock;

  const preOrderOverride = variantIsPreorder
    ? productSettings?.preOrderOverrides?.find(
        (o) => o.product?.handle === selectedVariant?.product?.handle,
      )
    : undefined;

  let buttonText = '';
  if (failed) {
    buttonText = productSettings?.addToCart?.failedText || 'Failed To Add';
  } else if (variantIsPreorder) {
    buttonText = productSettings?.addToCart?.preorderText || 'Preorder';
  } else if (variantIsSoldOut) {
    buttonText = enabledNotifyMe
      ? productSettings?.backInStock?.notifyMeText || 'Notify Me'
      : productSettings?.addToCart?.soldOutText || 'Sold Out';
  } else {
    buttonText =
      addToCartTextOverride ||
      productSettings?.addToCart?.addToCartText ||
      'Add To Cart';
  }

  const cartIsUpdating = status === 'creating' || status === 'updating';

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant?.id || isAdding || cartIsUpdating) return;
    setIsAdding(true);
    setFailed(false);

    const lineAttributes = [...(attributes || [])];
    if (variantIsPreorder && preOrderOverride?.shippingDateText) {
      lineAttributes.push({
        key: 'Estimated Ship Date',
        value: preOrderOverride.shippingDateText,
      });
    }

    const data = await linesAdd([
      {
        attributes: lineAttributes,
        merchandiseId: selectedVariant.id,
        quantity,
        sellingPlanId,
      },
    ]);
    if (data) {
      if (data.userErrors?.length) {
        setIsAdding(false);
        setFailed(true);
        setTimeout(() => setFailed(false), 3000);
      } else {
        setIsAdding(false);
        setIsAdded(true);
        openCart();
        setTimeout(() => setIsAdded(false), 1000);
      }
    }
  }, [
    attributes,
    isAdding,
    linesAdd,
    preOrderOverride?.shippingDateText,
    quantity,
    selectedVariant?.id,
    sellingPlanId,
    status,
    variantIsPreorder,
  ]);

  const handleNotifyMe = useCallback(
    (component: React.ReactNode) => {
      if (!selectedVariant?.id) return;
      openModal(component);
    },
    [selectedVariant?.id],
  );

  useEffect(() => {
    if (!isPreviewModeEnabled) return;
    if (isAdding && status === 'idle') {
      setIsAdding(false);
      setIsAdded(true);
      openCart();
      setTimeout(() => setIsAdded(false), 1000);
    }
  }, [status, isAdding, isPreviewModeEnabled]);

  useEffect(() => {
    if (!error) return;
    if (Array.isArray(error)) {
      error.forEach((e) => {
        console.error('useCart:error', e.message);
      });
    } else {
      console.error('useCart:error', error);
    }
  }, [error]);

  return {
    buttonText,
    cartIsUpdating, // cart is updating
    failed,
    handleAddToCart,
    handleNotifyMe,
    isAdded, // line is added (true for only a second)
    isAdding, // line is adding
    isNotifyMe: !!variantIsSoldOut && enabledNotifyMe,
    isPreorder: variantIsPreorder,
    isSoldOut: !!variantIsSoldOut,
    preOrderShippingText: preOrderOverride?.shippingDateText || '',
    subtext: productSettings?.addToCart?.subtext,
  };
}
