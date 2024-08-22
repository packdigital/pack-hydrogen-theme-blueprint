import {PackEventName} from '../constants';

export const ANALYTICS_NAME = 'MetaPixelEvents';

const logSubscription = ({
  data,
  packEventName,
}: {
  data: Record<string, any>;
  packEventName: string;
}) => {
  console.log(
    `${ANALYTICS_NAME}: 📥 subscribed to analytics for \`${packEventName}\`:`,
    data,
  );
};

const logError = ({
  packEventName,
  message = 'Unknown error',
}: {
  packEventName: string;
  message?: string | unknown;
}) => {
  console.error(
    `${ANALYTICS_NAME}: ❌ error from \`${packEventName}\`: ${message}`,
  );
};

const emitEvent = ({
  eventName,
  parameters,
  debug,
  onEmit,
}: {
  eventName: string;
  parameters?: Record<string, any>;
  debug?: boolean;
  onEmit?: (event: Record<string, any>) => void;
}) => {
  try {
    if (window.fbq) {
      window.fbq('track', eventName, parameters);
    } else {
      throw new Error('`window.fbq` is not defined.');
    }
    if (debug)
      console.log(
        `MetaPixelEvents: 🚀 event emitted for \`${eventName}\`:`,
        parameters || {},
      );
    if (typeof onEmit === 'function') onEmit({eventName, parameters});
  } catch (error) {
    logError({
      packEventName: 'emitEvent',
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewProductEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const packEventName = PackEventName.PRODUCT_VIEWED;
  try {
    if (debug) logSubscription({data, packEventName});

    const {product} = data.customData;
    if (!product)
      throw new Error('`product` parameter is missing in `customData`.');

    const eventName = 'ViewContent';
    const parameters = {
      content_name: product.title,
      content_category: product.productType,
      content_ids: [product.id],
      content_type: 'product',
      currency: product.priceRange?.minVariantPrice?.currencyCode,
      value: Number(product.priceRange?.minVariantPrice?.amount),
    };

    emitEvent({eventName, parameters, debug});
  } catch (error) {
    logError({
      packEventName,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const addToCartEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const packEventName = PackEventName.PRODUCT_ADD_TO_CART;
  try {
    if (debug) logSubscription({data, packEventName});

    const {cart, currentLine} = data;
    if (!cart || !currentLine)
      throw new Error('`cart` and/or `currentLine` parameters are missing.');

    const {quantity} = currentLine;
    const {product} = currentLine.merchandise;
    const {amount, currencyCode} = currentLine.cost.totalAmount;

    const eventName = 'AddToCart';
    const parameters = {
      content_ids: [product.id],
      content_type: 'product',
      contents: [{id: product.id, quantity}],
      value: Number(amount) * quantity,
      currency: currencyCode,
    };

    emitEvent({eventName, parameters, debug});
  } catch (error) {
    logError({
      packEventName,
      message: error instanceof Error ? error.message : error,
    });
  }
};

export {emitEvent, viewProductEvent, addToCartEvent};
