import {AnalyticsEvent as HydrogenAnalyticsEvent} from '@shopify/hydrogen';

// Default AnalyticsEvent ------------------------------
// PAGE_VIEWED: "page_viewed";
// PRODUCT_VIEWED: "product_viewed";
// COLLECTION_VIEWED: "collection_viewed";
// CART_VIEWED: "cart_viewed";
// SEARCH_VIEWED: "search_viewed";
// CART_UPDATED: "cart_updated";
// PRODUCT_ADD_TO_CART: "product_added_to_cart";
// PRODUCT_REMOVED_FROM_CART: "product_removed_from_cart";
// CUSTOM_EVENT: `custom_${string}`;

// `actionField.list` values for the two search surfaces. They publish the same
// `SEARCH_VIEWED` event, so these are what let downstream tell "a shopper
// searched" (typeahead drawer) apart from "a shopper opened full results"
// (/search route) instead of summing them as one metric.
export const SEARCH_RESULTS_LIST = 'search results';
export const PREDICTIVE_SEARCH_LIST = 'predictive search results';

export const AnalyticsEvent = {
  ...HydrogenAnalyticsEvent,
  PRODUCT_VARIANT_SELECTED: 'custom_product_variant_selected',
  PRODUCT_ITEM_CLICKED: 'custom_product_item_clicked',
  PRODUCT_QUICK_SHOP_VIEWED: 'custom_product_quick_shop_viewed',
  CUSTOMER: 'custom_customer',
  CUSTOMER_SUBSCRIBED: 'custom_customer_subscribed',
  CUSTOMER_LOGGED_IN: 'custom_customer_logged_in',
  CUSTOMER_REGISTERED: 'custom_customer_registered',
} as typeof HydrogenAnalyticsEvent & {
  PRODUCT_VARIANT_SELECTED: 'custom_product_variant_selected';
  PRODUCT_ITEM_CLICKED: 'custom_product_item_clicked';
  PRODUCT_QUICK_SHOP_VIEWED: 'custom_product_quick_shop_viewed';
  CUSTOMER: 'custom_customer';
  CUSTOMER_SUBSCRIBED: 'custom_customer_subscribed';
  CUSTOMER_LOGGED_IN: 'custom_customer_logged_in';
  CUSTOMER_REGISTERED: 'custom_customer_registered';
};
