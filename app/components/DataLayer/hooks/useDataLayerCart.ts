import {useEffect, useCallback, useRef, useState} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import type {CartWithActions} from '@shopify/hydrogen-react';
import {useLocation} from '@remix-run/react';
import equal from 'fast-deep-equal';
import type {
  CurrencyCode,
  CartLine,
} from '@shopify/hydrogen-react/storefront-api-types';

import {pathWithoutLocalePrefix} from '~/lib/utils';
import {useGlobal} from '~/hooks';

import {isElevar, mapCartLine} from './utils';
import type {UserProperties} from './useDataLayerInit';

type DlCartLine = CartLine & {index?: number; list?: string};

export function useDataLayerCart({
  cartReady,
  currencyCode,
  handleDataLayerEvent,
  userDataEvent,
  userDataEventTriggered,
  userProperties,
}: {
  cartReady: boolean;
  currencyCode?: CurrencyCode | undefined;
  handleDataLayerEvent: (event: Record<string, any>) => void;
  userDataEvent: (arg0: any) => void;
  userDataEventTriggered: boolean;
  userProperties: UserProperties;
}) {
  const pathnameRef = useRef<string | null>(null);
  const location = useLocation();
  const pathname = pathWithoutLocalePrefix(location.pathname);
  const cart = useCart();
  const {lines = [], status, totalQuantity = 0} = cart;
  const cartLines = lines as CartLine[];
  const {cartOpen} = useGlobal();

  const [mounted, setMounted] = useState(false);
  const [previousCartCount, setPreviousCartCount] = useState<number | null>(
    null,
  );
  const [previousCartLines, setPreviousCartLines] = useState<CartLine[] | null>(
    null,
  );
  const [previousCartLinesMap, setPreviousCartLinesMap] = useState<Record<
    string,
    CartLine[]
  > | null>(null);

  const addToCartEvent = useCallback(
    ({
      cart: _cart,
      lines,
      userProperties: _userProperties,
    }: {
      cart: CartWithActions;
      lines: DlCartLine[];
      userProperties: UserProperties;
    }) => {
      if (!lines.length) return;
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
      const list =
        (windowPathname.startsWith('/collections') && windowPathname) ||
        (previousPath?.startsWith('/collections') && previousPath) ||
        '';
      const event = {
        event: 'dl_add_to_cart',
        ...(isElevar
          ? {cart_total: _cart?.cost?.totalAmount?.amount || '0.0'}
          : null),
        user_properties: _userProperties,
        ecommerce: {
          currencyCode:
            lines[0].cost?.totalAmount?.currencyCode || currencyCode,
          add: {
            actionField: {list},
            products: lines.map(mapCartLine(list)),
          },
          ...(!isElevar
            ? {
                cart_id: _cart.id?.split('/').pop(),
                cart_total: _cart.cost?.totalAmount?.amount,
                cart_count:
                  lines.reduce((acc, line) => acc + line.quantity, 0) || 0,
              }
            : null),
        },
      };
      handleDataLayerEvent(event);
    },
    [],
  );

  const removeFromCartEvent = useCallback(
    ({
      cart: _cart,
      lines,
      userProperties: _userProperties,
    }: {
      cart: CartWithActions;
      lines: DlCartLine[];
      userProperties: UserProperties;
    }) => {
      if (!lines.length) return;
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
      const list =
        (windowPathname.startsWith('/collections') && windowPathname) ||
        (previousPath?.startsWith('/collections') && previousPath) ||
        '';
      const event = {
        event: 'dl_remove_from_cart',
        user_properties: _userProperties,
        ...(isElevar
          ? {cart_total: _cart?.cost?.totalAmount?.amount || '0.0'}
          : null),
        ecommerce: {
          currencyCode:
            lines[0].cost?.totalAmount?.currencyCode || currencyCode,
          remove: {
            actionField: {list},
            products: lines.map(mapCartLine(list)),
          },
          ...(!isElevar
            ? {
                cart_id: _cart?.id?.split('/').pop(),
                cart_total: _cart?.cost?.totalAmount?.amount || '0.0',
                cart_count:
                  lines.reduce((acc, line) => acc + line.quantity, 0) || 0,
              }
            : null),
        },
      };
      handleDataLayerEvent(event);
    },
    [],
  );

  const viewCartEvent = useCallback(
    ({
      cart: _cart,
      userProperties: _userProperties,
    }: {
      cart: CartWithActions;
      userProperties: UserProperties;
    }) => {
      if (!_cart) return;
      const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
      const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
      const list =
        (windowPathname.startsWith('/collections') && windowPathname) ||
        (previousPath?.startsWith('/collections') && previousPath) ||
        '';
      const event = {
        event: 'dl_view_cart',
        user_properties: _userProperties,
        ...(isElevar
          ? {cart_total: _cart?.cost?.totalAmount?.amount || '0.0'}
          : null),
        ecommerce: {
          currencyCode: _cart?.cost?.totalAmount?.currencyCode || currencyCode,
          actionField: {list: 'Shopping Cart'},
          [isElevar ? 'impressions' : 'products']:
            _cart?.lines?.slice(0, 12).map(mapCartLine(list)) || [],
          ...(!isElevar
            ? {
                cart_id: _cart?.id?.split('/').pop(),
                cart_total: _cart?.cost?.totalAmount?.amount || '0.0',
                cart_count:
                  _cart?.lines?.reduce(
                    (acc, line) => acc + (line?.quantity || 0),
                    0,
                  ) || 0,
              }
            : null),
        },
      };
      handleDataLayerEvent(event);
    },
    [],
  );

  // Trigger 'dl_user_data' and 'dl_view_cart' events on cart page
  useEffect(() => {
    if (
      !pathname.startsWith('/cart') ||
      !cartReady ||
      !currencyCode ||
      !userProperties ||
      pathname === pathnameRef.current
    )
      return undefined;
    userDataEvent({userProperties});
    viewCartEvent({cart, userProperties});
    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = null;
    };
  }, [cartReady, pathname, !!userProperties]);

  // Trigger 'view_cart' event when cart is opened
  useEffect(() => {
    if (!cartOpen || !currencyCode || !userDataEventTriggered) return;
    if (isElevar) userDataEvent({userProperties});
    viewCartEvent({cart, userProperties});
  }, [cartOpen, !!currencyCode, userDataEventTriggered]);

  // Determine if a cart item was added, removed, or updated for events
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    if (!userDataEventTriggered) return;
    if (
      (status !== 'idle' && status !== 'uninitialized') ||
      totalQuantity === previousCartCount
    )
      return;

    const cartLinesMap = cartLines?.reduce(
      (acc: Record<string, CartLine[]>, line) => {
        if (!line.merchandise) return acc;
        const variantId = line.merchandise.id;
        if (!acc[variantId]) {
          return {...acc, [variantId]: [line]};
        }
        return {...acc, [variantId]: [...acc[variantId], line]};
      },
      {},
    );

    if (
      !previousCartLines ||
      previousCartCount === totalQuantity ||
      typeof previousCartCount !== 'number'
    ) {
      setPreviousCartLines(cartLines || []);
      setPreviousCartCount(totalQuantity || 0);
      setPreviousCartLinesMap(cartLinesMap || {});
      return;
    }

    const isAddedLines: DlCartLine[] = [];
    const isIncreasedLines: DlCartLine[] = [];
    const isRemovedLines: DlCartLine[] = [];
    const isDecreasedLines: DlCartLine[] = [];

    if (totalQuantity > previousCartCount) {
      cartLines.forEach((line, index) => {
        const variantId = line.merchandise?.id;
        if (!variantId) return;

        const previousLine = previousCartLinesMap?.[variantId]?.find(
          (prevLine: CartLine) => {
            const hasSameSellingPlanSelection =
              (!prevLine.sellingPlanAllocation &&
                !line.sellingPlanAllocation) ||
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
          isAddedLines.push({...line, index});
          return;
        }
        if (line.quantity > previousLine.quantity) {
          isIncreasedLines.push({
            ...line,
            quantity: line.quantity - previousLine.quantity,
            index,
          });
        }
      });
    } else if (totalQuantity < previousCartCount) {
      previousCartLines.forEach((prevLine: CartLine, index: number) => {
        const variantId = prevLine.merchandise?.id;
        if (!variantId) return;

        const currentLine = cartLinesMap?.[variantId]?.find(
          (line: CartLine) => {
            const hasSameSellingPlanSelection =
              (!prevLine.sellingPlanAllocation &&
                !line.sellingPlanAllocation) ||
              prevLine.sellingPlanAllocation?.sellingPlan?.id ===
                line.sellingPlanAllocation?.sellingPlan?.id;
            return (
              hasSameSellingPlanSelection &&
              equal(prevLine.attributes, line.attributes) &&
              equal(prevLine.discountAllocations, line.discountAllocations)
            );
          },
        );
        if (!currentLine) {
          isRemovedLines.push({...prevLine, index});
          return;
        }
        if (currentLine.quantity < prevLine.quantity) {
          isDecreasedLines.push({
            ...prevLine,
            quantity: prevLine.quantity - currentLine.quantity,
            index,
          });
        }
      });
    }

    if (isAddedLines.length || isIncreasedLines.length) {
      addToCartEvent({
        cart,
        lines: [...isAddedLines, ...isIncreasedLines],
        userProperties,
      });
    }
    if (isRemovedLines.length || isDecreasedLines.length) {
      removeFromCartEvent({
        cart,
        lines: [...isRemovedLines, ...isDecreasedLines],
        userProperties,
      });
    }

    setPreviousCartLines(cartLines);
    setPreviousCartCount(totalQuantity);
    setPreviousCartLinesMap(cartLinesMap);
  }, [status, userDataEventTriggered]);
}
