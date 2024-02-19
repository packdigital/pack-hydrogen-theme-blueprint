import {useEffect, useState} from 'react';
import equal from 'fast-deep-equal';
import type {ShopifyAddToCartPayload} from '@shopify/hydrogen-react';
import {useCart} from '@shopify/hydrogen-react';
import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
} from '@shopify/hydrogen';
import type {ShopifyPageViewPayload} from '@shopify/hydrogen';
import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

type AddedItem = CartLine & {
  index: number;
  quantityAdded: number;
  totalPrice: string;
};

export function useAddToCartAnalytics({
  pageAnalytics,
  DEBUG,
}: {
  pageAnalytics: ShopifyPageViewPayload;
  DEBUG: boolean;
}) {
  const {id, lines = [], status, totalQuantity = 0} = useCart();
  const cartLines = lines as CartLine[];

  const [mounted, setMounted] = useState(false);
  const [previousCartCount, setPreviousCartCount] = useState(0);
  const [previousCartLines, setPreviousCartLines] = useState<
    CartLine[] | undefined
  >(undefined);
  const [previousCartLinesMap, setPreviousCartLinesMap] = useState<
    Record<string, CartLine[]> | undefined
  >(undefined);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    if (status !== 'idle' && status !== 'uninitialized') return;

    const cartItemsMap = cartLines.reduce(
      (acc: Record<string, CartLine[]>, line: CartLine) => {
        if (!line.merchandise) return acc;
        const variantId = line.merchandise.id;
        if (!acc[variantId]) {
          return {...acc, [variantId]: [line]};
        }
        return {...acc, [variantId]: [...acc[variantId], line]};
      },
      {},
    );

    if (!previousCartLines || totalQuantity <= previousCartCount) {
      setPreviousCartLines(cartLines || []);
      setPreviousCartCount(totalQuantity || 0);
      setPreviousCartLinesMap(cartItemsMap || {});
      return;
    }

    const isAddedItems: AddedItem[] = [];
    const isIncreasedItems: AddedItem[] = [];

    cartLines.forEach((line, index) => {
      const variantId = line.merchandise?.id;
      if (!variantId) return;

      const previousLine = previousCartLinesMap?.[variantId]?.find(
        (prevLine: CartLine) => {
          const hasSameSellingPlanSelection =
            (!prevLine.sellingPlanAllocation && !line.sellingPlanAllocation) ||
            prevLine.sellingPlanAllocation?.sellingPlan?.id ===
              line.sellingPlanAllocation?.sellingPlan?.id;
          return (
            hasSameSellingPlanSelection &&
            equal(prevLine.attributes, line.attributes) &&
            equal(prevLine.discountAllocations, line.discountAllocations)
          );
        },
      );
      if (!previousLine) {
        isAddedItems.push({
          ...line,
          index,
          quantityAdded: line.quantity,
          totalPrice: line.cost?.totalAmount?.amount,
        });
        return;
      }
      if (line.quantity > previousLine.quantity) {
        const quantityAdded = line.quantity - previousLine.quantity;
        const totalAmount = line.cost?.totalAmount?.amount || '0';
        isIncreasedItems.push({
          ...line,
          index,
          quantityAdded,
          totalPrice: (
            (parseFloat(totalAmount) / line.quantity) *
            quantityAdded
          ).toFixed(2),
        });
      }
    });

    const updatedCartItems = [...isAddedItems, ...isIncreasedItems];

    if (!updatedCartItems.length) return;

    const totalValue = updatedCartItems.reduce((acc, line) => {
      return acc + parseFloat(line.cost?.totalAmount?.amount || '0');
    }, 0);
    const products = updatedCartItems.map((line) => {
      return {
        productGid: line.merchandise.product.id,
        name: line.merchandise.product.title,
        price: line.cost?.totalAmount?.amount,
        variantGid: line.merchandise.id,
        variantName: line.merchandise.title,
        category: line.merchandise.product.productType,
        brand: line.merchandise.product.vendor,
        ...(line.merchandise.sku ? {sku: line.merchandise.sku} : null),
        quantity: line.quantityAdded,
      };
    });

    const cartData = {totalValue, products};
    const addToCartPayload: ShopifyAddToCartPayload = {
      ...pageAnalytics,
      ...getClientBrowserParameters(),
      ...cartData,
      cartId: id || '',
    };

    const sendAddToCartAnalytics = async () => {
      const event = {
        eventName: AnalyticsEventName.ADD_TO_CART,
        payload: addToCartPayload,
      };
      await sendShopifyAnalytics(event);
      if (DEBUG) console.log('sendShopifyAnalytics:add_to_cart', event);
      setPreviousCartLines(cartLines);
      setPreviousCartCount(totalQuantity);
      setPreviousCartLinesMap(cartItemsMap);
    };
    sendAddToCartAnalytics();
  }, [pageAnalytics, status]);
}
