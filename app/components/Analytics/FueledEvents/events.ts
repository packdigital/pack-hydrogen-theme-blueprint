import {v4 as uuidv4} from 'uuid';

import {AnalyticsEvent} from '../constants';

import {
  flattenConnection,
  pathWithoutLocalePrefix,
  generateUserProperties,
  mapCartLine,
  mapProductItemVariant,
  mapProductPageVariant,
  mapProductItemProduct,
} from './utils';

export const ANALYTICS_NAME = 'FueledEvents';

const PAGE_TYPES: Record<string, string> = {
  '/': 'home',
  '/account': 'customersAccount',
  '/account/activate': 'customersActivateAccount',
  '/account/addresses': 'customersAddresses',
  '/account/login': 'customersLogin',
  '/account/orders/': 'customersOrders',
  '/account/register': 'customersRegister',
  '/account/reset': 'customersResetPassword',
  '/articles': 'article',
  '/blogs': 'blog',
  '/cart': 'cart',
  '/collections': 'collection',
  '/not-found': 'notFound',
  '/pages': 'page',
  '/404': 'notFound',
  '/pages/privacy-policy': 'policy',
  '/pages/search': 'search',
  '/products': 'product',
  '/search': 'search',
};

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

const dispatchEvent = ({
  event,
  debug,
  onDispatch,
}: {
  event: Record<string, any>;
  debug?: boolean;
  onDispatch?: (event: Record<string, any>) => void;
}) => {
  try {
    const dispatchedEvent = {
      ...event,
      event_id: uuidv4(),
      event_time: new Date().toISOString(),
    } as Record<string, any>;
    window.dispatchEvent(
      new CustomEvent(dispatchedEvent.event, {
        detail: dispatchedEvent,
      }),
    );
    if (debug)
      console.log(
        `${ANALYTICS_NAME}: 🚀 dispatched event listener for \`${dispatchedEvent.event}\`:`,
        dispatchedEvent,
      );
    if (typeof onDispatch === 'function') onDispatch(dispatchedEvent);
  } catch (error) {
    logError({
      analyticsEvent: 'dispatchEvent',
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerEvent = ({
  onDispatch,
  debug,
  ...data
}: Record<string, any> & {
  onDispatch?: (event: Record<string, any>) => void;
  debug?: boolean;
}) => {
  const analyticsEvent = AnalyticsEvent.CUSTOMER;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer: providerCustomer, shop} = data;
    const {customer: customCustomer, cart} = data.customData;
    const customer =
      typeof customCustomer !== 'undefined' ? customCustomer : providerCustomer;
    if (typeof customer === 'undefined')
      throw new Error('`customer` parameter is missing in `customData`.');
    if (typeof cart === 'undefined')
      console.warn('`cart` parameter is missing in `customData`.');

    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
    const list =
      (windowPathname.startsWith('/collections') && windowPathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const event = {
      event: 'dl_user_data',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currency_code: cart?.cost?.totalAmount?.currencyCode || shop?.currency,
        cart_contents: {
          products:
            flattenConnection(cart?.lines)?.map(mapCartLine(list)) || [],
        },
        cart_total: cart?.cost?.totalAmount?.amount || '0.0',
      },
    };
    dispatchEvent({event, onDispatch, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewPageEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PAGE_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {url, customer} = data;
    if (!url) throw new Error('`url` parameter is missing.');

    const newUrl = new URL(url);
    const {pathname, search} = newUrl;
    const pageType = pathname.startsWith('/account/orders/')
      ? PAGE_TYPES['/account/orders/']
      : PAGE_TYPES[pathname] ||
        PAGE_TYPES[pathname.split('/').slice(0, -1).join('/')] ||
        '';
    const event = {
      event: 'dl_route_update',
      user_properties: generateUserProperties({customer}),
      page: {
        path: pathname,
        title: document.title,
        type: pageType,
        search,
      },
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewProductEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer, shop} = data;
    const {product, selectedVariant} = data.customData;
    if (!product)
      throw new Error('`product` parameter is missing in `customData`.');

    let variant = selectedVariant;
    if (!variant) variant = flattenConnection(product.variants)?.[0];
    if (!variant) return;
    variant = {
      ...variant,
      image: variant.image || product.featuredImage,
      product: {
        ...variant.product,
        vendor: product.vendor,
        collections: product.collections,
      },
    };
    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list = previousPath?.startsWith('/collections') ? previousPath : '';
    const event = {
      event: 'dl_view_item',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currency_code: variant.price?.currencyCode || shop?.currency,
        detail: {
          actionField: {list, action: 'detail'},
          products: [variant].map(mapProductPageVariant(list)),
        },
      },
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewCollectionEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.COLLECTION_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer, shop} = data;
    const {collection} = data.customData;
    if (!collection)
      throw new Error('`collection` parameter is missing in `customData`.');

    const windowPathname = pathWithoutLocalePrefix(window.location.pathname);
    const list = windowPathname.startsWith('/collections')
      ? windowPathname
      : '';
    const products = flattenConnection(collection.products);
    const event = {
      event: 'dl_view_item_list',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currency_code:
          flattenConnection(products?.[0]?.variants)?.[0]?.price
            ?.currencyCode || shop?.currency,
        collection_title: collection.title,
        collection_id: collection.id?.split('/').pop(),
        products: products?.slice(0, 12).map(mapProductItemProduct(list)),
      },
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewSearchResultsEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.SEARCH_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {searchResults, searchTerm, customer, shop} = data;
    if (!searchResults || !searchTerm)
      throw new Error(
        '`searchTerm` and/or `searchResults` parameters are missing.',
      );

    const event = {
      event: 'dl_view_search_results',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currency_code:
          flattenConnection(searchResults[0]?.variants)?.[0]?.price
            ?.currencyCode || shop?.currency,
        actionField: {
          list: 'search results',
          search_term: searchTerm,
        },
        products: searchResults.slice(0, 12).map(mapProductItemProduct()),
      },
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const viewCartEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.CART_VIEWED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {cart: providerCart, customer, shop, url} = data;
    const {cart: customCart} = data.customData;
    const cart = customCart || providerCart;

    let pathname = undefined;
    try {
      pathname = new URL(url).pathname;
    } catch (error) {}
    if (!cart && pathname === '/cart')
      throw new Error('`cart` parameter is missing in `customData`.');

    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list =
      (window.location.pathname.startsWith('/collections') &&
        window.location.pathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const cartCurrencyCode = cart?.cost?.totalAmount?.currencyCode;
    const event = {
      event: 'dl_view_cart',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currencyCode:
          cartCurrencyCode && cartCurrencyCode !== 'XXX'
            ? cartCurrencyCode
            : shop?.currency,
        actionField: {list: 'Shopping Cart'},
        products:
          flattenConnection(cart?.lines)?.slice(0, 12).map(mapCartLine(list)) ||
          [],
        cart_id: cart?.id?.split('/').pop() || 'uninitialized',
        cart_total: cart?.cost?.totalAmount?.amount || '0.0',
        cart_count: cart?.totalQuantity || 0,
      },
    };
    dispatchEvent({event, debug});
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

    const {cart, currentLine, customer, prevLine, shop} = data;
    if (!cart || !currentLine)
      throw new Error('`cart` and/or `currentLine` parameters are missing.');

    const lineAdded = {
      ...currentLine,
      quantity: (currentLine.quantity || 1) - (prevLine?.quantity || 0),
    };
    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list =
      (window.location.pathname.startsWith('/collections') &&
        window.location.pathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const event = {
      event: 'dl_add_to_cart',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currency_code: cart.cost?.totalAmount?.currencyCode || shop?.currency,
        add: {
          actionField: {list},
          products: [lineAdded].map(mapCartLine(list)),
        },
        cart_id: cart.id?.split('/').pop(),
        cart_total: cart.cost?.totalAmount?.amount || '0.0',
        cart_count: cart.totalQuantity,
      },
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const removeFromCartEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_REMOVED_FROM_CART;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {cart, currentLine, customer, prevLine, shop} = data;
    if (!cart || !prevLine)
      throw new Error('`cart` and/or `prevLine` parameters are missing.');

    const lineRemoved = {
      ...prevLine,
      quantity: (prevLine.quantity || 1) - (currentLine?.quantity || 0),
    };
    const previousPath = sessionStorage.getItem('PREVIOUS_PATH');
    const list =
      (window.location.pathname.startsWith('/collections') &&
        window.location.pathname) ||
      (previousPath?.startsWith('/collections') && previousPath) ||
      '';
    const event = {
      event: 'dl_remove_from_cart',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currency_code: cart.cost?.totalAmount?.currencyCode || shop?.currency,
        remove: {
          actionField: {list},
          products: [lineRemoved].map(mapCartLine(list)),
        },
        cart_id: cart.id?.split('/').pop(),
        cart_total: cart.cost?.totalAmount?.amount || '0.0',
        cart_count: cart.totalQuantity,
      },
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const clickProductItemEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_ITEM_CLICKED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {product, listIndex, searchTerm, customer, shop} = data;
    let {selectedVariant} = data;
    if (!selectedVariant)
      selectedVariant = flattenConnection(product?.variants)?.[0];
    if (!selectedVariant)
      throw new Error('`selectedVariant` parameter is missing.');

    const list = window.location.pathname.startsWith('/collections')
      ? window.location.pathname
      : '';

    const variant = {
      ...selectedVariant,
      image: selectedVariant.image || product?.featuredImage || '',
      index: listIndex,
      product: {
        ...selectedVariant.product,
        vendor: product?.vendor,
        collections: product?.collections,
      },
      list,
    };

    const event = {
      event: 'dl_select_item',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currency_code: variant.price?.currencyCode || shop?.currency,
        click: {
          actionField: {
            list: searchTerm ? 'search results' : list,
            action: 'click',
            ...(!!searchTerm && {search_term: searchTerm}),
          },
          products: [variant].map(mapProductItemVariant(list)),
        },
      },
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const clickProductVariantEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.PRODUCT_VARIANT_SELECTED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {
      selectedVariant,
      optionName,
      optionValue,
      fromGrouping,
      fromProductHandle,
      customer,
      shop,
    } = data;
    if (!selectedVariant)
      throw new Error('`selectedVariant` parameter is missing.');

    const list = window.location.pathname.startsWith('/collections')
      ? window.location.pathname
      : '';

    const variant = {
      ...selectedVariant,
      image: selectedVariant.image || '',
      list,
    };

    const event = {
      event: 'dl_select_item_variant',
      user_properties: generateUserProperties({customer}),
      ecommerce: {
        currency_code: variant.price?.currencyCode || shop?.currency,
        click: {
          actionField: {list, action: 'click'},
          products: [variant].map(mapProductItemVariant(list)),
          optionName,
          optionValue: optionValue?.name,
          fromGrouping: fromGrouping || false,
          fromProductHandle,
        },
      },
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerLogInEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.CUSTOMER_LOGGED_IN;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer} = data;
    if (!customer) throw new Error('`customer` parameter is missing.');

    const event = {
      event: 'dl_login',
      user_properties: generateUserProperties({customer}),
    };
    dispatchEvent({event, debug});
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

const customerRegisterEvent = ({
  debug,
  ...data
}: Record<string, any> & {debug?: boolean}) => {
  const analyticsEvent = AnalyticsEvent.CUSTOMER_REGISTERED;
  try {
    if (debug) logSubscription({data, analyticsEvent});

    const {customer} = data;
    if (!customer) throw new Error('`customer` parameter is missing.');

    const event = {
      event: 'dl_sign_up',
      user_properties: generateUserProperties({customer}),
    };
    dispatchEvent({event, debug});
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

    const {email, phone} = data;
    if (!email && !phone)
      throw new Error('`email` or `phone` parameter is missing.');

    if (email) {
      const event = {
        event: 'dl_subscribe',
        lead_type: 'email',
        user_properties: {customer_email: email},
      };
      dispatchEvent({event, debug});
    }
    if (phone) {
      const event = {
        event: 'dl_subscribe',
        lead_type: 'phone',
        user_properties: {customer_phone: phone},
      };
      dispatchEvent({event, debug});
    }
  } catch (error) {
    logError({
      analyticsEvent,
      message: error instanceof Error ? error.message : error,
    });
  }
};

export {
  addToCartEvent,
  clickProductItemEvent,
  clickProductVariantEvent,
  customerEvent,
  customerLogInEvent,
  customerRegisterEvent,
  customerSubscribeEvent,
  dispatchEvent,
  removeFromCartEvent,
  viewCartEvent,
  viewCollectionEvent,
  viewPageEvent,
  viewProductEvent,
  viewSearchResultsEvent,
};
