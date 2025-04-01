import {AnalyticsEvent} from '../constants';

import {
  pathWithoutLocalePrefix,
  mapCartLine,
  mapProductPageVariant,
} from './utils';

export const ANALYTICS_NAME = 'KlaviyoEvents';

const logSubscription = ({
  data,
  analyticsEvent,
}: {
  data: Record<string, any>;
  analyticsEvent: string;
}) => {
  console.log(
    `${ANALYTICS_NAME}: 📥 subscribed to analytics for \`${analyticsEvent}\`:`,
    data,
  );
};

const logError = ({
  analyticsEvent,
  message = 'Unknown error',
}: {
  analyticsEvent: string;
  message?: string | unknown;
}) => {
  console.error(
    `${ANALYTICS_NAME}: ❌ error from \`${analyticsEvent}\`: ${message}`,
  );
};

export const identifyCustomer = async ({
  email,
  debug,
}: {
  email: string;
  debug?: boolean;
}) => {
  if (!window.klaviyo) return;
  await window.klaviyo.identify({email});
  if (debug)
    console.log(
      `${ANALYTICS_NAME}: 🚀 event emitted for \`identify customer\`:`,
      {email},
    );
};

export const emitEvent = async ({
  email,
  event,
  properties,
  debug,
}: {
  email: string;
  event: string;
  properties: Record<string, any> | null;
  debug?: boolean;
}) => {
  if (!window.klaviyo) return;
  const klaviyoIdentified = await window.klaviyo.isIdentified();
  if (klaviyoIdentified) {
    window.klaviyo.push(['track', event, properties]);
  } else if (email) {
    await window.klaviyo.identify({email});
    window.klaviyo.push(['track', event, properties]);
  }
  if (debug)
    console.log(`${ANALYTICS_NAME}: 🚀 event emitted for \`${event}\`:`, {
      event,
      email,
      properties,
    });
};

const viewProductEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer} = data;
    const {selectedVariant} = data.customData;
    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list = previousPath?.startsWith('/collections') ? previousPath : '';
    emitEvent({
      email: customer?.email,
      event: 'Viewed Product',
      properties: mapProductPageVariant(list)(selectedVariant),
      debug,
    });
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const addToCartEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_ADD_TO_CART;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {currentLine, customer, prevLine} = data;
    if (!currentLine)
      throw new Error('`cart` and/or `currentLine` parameters are missing.');

    const lineAdded = {
      ...currentLine,
      quantity: (currentLine.quantity || 1) - (prevLine?.quantity || 0),
    };
    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
    const list =
      (windowPathname.startsWith('/collections') && windowPathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const productProps = mapCartLine(list)(lineAdded);
    emitEvent({
      email: customer?.email,
      event: 'Added to Cart',
      properties: productProps,
      debug,
    });
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerSubscribeEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.CUSTOMER_SUBSCRIBED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {email} = data;
    if (!email) throw new Error('`email` parameter is missing.');

    identifyCustomer({email, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

export {addToCartEvent, customerSubscribeEvent, viewProductEvent};
