/**
 * Alias of `/discounts/:code` at the singular `/discount/:code` path, which is
 * the format Shopify admin and most marketing apps generate for discount links
 * @example
 * ```ts
 * /discount/FREESHIPPING?redirect=/products
 * ```
 */
export {loader} from './($locale).discounts.$code';
