import {AnalyticsEvent} from '../constants';

import {
  flattenConnection,
  edgeTagMapCartLine,
  edgeTagMapVariant,
} from './utils';

export const ANALYTICS_NAME = 'BlotoutEvents';

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

const customerEvent = ({
  onEmit,
  debug,
  ...data
}: Record<string, any> & {
  onEmit?: (event: Record<string, any>) => void;
  debug?: boolean;
}) => {
  const packEventName = AnalyticsEvent.CUSTOMER;
  try {
    if (debug) logSubscription({data, packEventName});

    const {customer: providerCustomer} = data;
    const {customer: customCustomer} = data.customData;
    const customer =
      typeof customCustomer !== 'undefined' ? customCustomer : providerCustomer;
    if (typeof customer === 'undefined')
      throw new Error('`customer` parameter is missing in `customData`.');
    if (!customer) return;

    const customerObject = {
      email: customer.email,
      city: customer.defaultAddress?.city || '',
      firstName: customer.firstName,
      lastName: customer.lastName,
    };

    if (!window.edgetag) throw new Error('`edgetag` is not defined.');

    window.edgetag('data', customerObject, {}, {method: 'beacon'});

    if (debug)
      console.log(
        `${ANALYTICS_NAME}: 🚀 event emitted for \`Customer\`:`,
        customerObject,
      );
  } catch (error) {
    logError({
      packEventName,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewPageEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const packEventName = AnalyticsEvent.PAGE_VIEWED;
  try {
    if (debug) logSubscription({data, packEventName});

    if (!window.edgetag) throw new Error('`edgetag` is not defined.');

    window.edgetag('tag', 'PageView');

    if (debug)
      console.log(`${ANALYTICS_NAME}: 🚀 event emitted for \`PageView\``);
  } catch (error) {
    logError({
      packEventName,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewProductEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const packEventName = AnalyticsEvent.PRODUCT_VIEWED;
  try {
    if (debug) logSubscription({data, packEventName});

    const {product, selectedVariant} = data.customData;
    if (!product)
      throw new Error('`product` parameter is missing in `customData`.');

    let variant = selectedVariant;
    if (!variant) variant = flattenConnection(product.variants)?.[0];
    if (!variant) return;

    if (!window.edgetag) throw new Error('`edgetag` is not defined.');

    const contents = [edgeTagMapVariant(variant)];
    window.edgetag('tag', 'ViewContent', {
      contents,
      currency: variant.price?.currencyCode,
      value: Number(variant.price?.amount),
    });

    if (debug)
      console.log(
        `${ANALYTICS_NAME}: 🚀 event emitted for \`ViewContent\`:`,
        contents,
      );
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
  const packEventName = AnalyticsEvent.PRODUCT_ADD_TO_CART;
  try {
    if (debug) logSubscription({data, packEventName});

    const {currentLine, prevLine} = data;
    if (!currentLine)
      throw new Error('`cart` and/or `currentLine` parameters are missing.');

    const lineAdded = {
      ...currentLine,
      quantity: (currentLine.quantity || 1) - (prevLine?.quantity || 0),
    };
    const contents = [lineAdded].map(edgeTagMapCartLine);

    if (!window.edgetag) throw new Error('`edgetag` is not defined.');

    window.edgetag('tag', 'AddToCart', {
      contents,
      currency: lineAdded.cost?.totalAmount?.currencyCode,
      value: Number(lineAdded.cost?.totalAmount?.amount),
    });

    if (debug)
      console.log(
        `${ANALYTICS_NAME}: 🚀 event emitted for \`AddToCart\`:`,
        contents,
      );
  } catch (error) {
    logError({
      packEventName,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerRegisterEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const packEventName = AnalyticsEvent.CUSTOMER_REGISTERED;
  try {
    if (debug) logSubscription({data, packEventName});

    if (!window.edgetag) throw new Error('`edgetag` is not defined.');

    window.edgetag(
      'tag',
      'CompleteRegistration',
      {},
      {},
      {
        method: 'beacon',
      },
    );

    if (debug)
      console.log(
        `${ANALYTICS_NAME}: 🚀 event emitted for \`CompleteRegistration\``,
      );
  } catch (error) {
    logError({
      packEventName,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerSubscribeEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const packEventName = AnalyticsEvent.CUSTOMER_SUBSCRIBED;
  try {
    if (debug) logSubscription({data, packEventName});

    const {email, phone} = data;
    if (!email && !phone)
      throw new Error('`email` or `phone` parameter is missing.');

    if (!window.edgetag) throw new Error('`edgetag` is not defined.');

    if (email) {
      window.edgetag('user', 'email', email);
      window.edgetag('tag', 'Subscribe', {
        sourceId: 'Email',
      });
    }
    if (phone) {
      window.edgetag('user', 'phone', phone);
      window.edgetag('tag', 'Subscribe', {
        sourceId: 'Phone',
      });
    }

    if (debug)
      console.log(
        `${ANALYTICS_NAME}: 🚀 event emitted for \`Subscribe\`: ${
          email || phone
        }`,
      );
  } catch (error) {
    logError({
      packEventName,
      message: error instanceof Error ? error.message : error,
    });
  }
};

export {
  addToCartEvent,
  customerEvent,
  customerRegisterEvent,
  customerSubscribeEvent,
  viewPageEvent,
  viewProductEvent,
};
