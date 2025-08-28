import {Money} from '@shopify/hydrogen';
import type {QuantityPriceBreak} from '@shopify/hydrogen/storefront-api-types';

/**
 * @example
 * ```tsx
 *  <B2BPriceBreaks
 *    quantityPriceBreaks={selectedVariant?.quantityPriceBreaks?.nodes}
 *  />
 * ```
 */

export function B2BPriceBreaks({
  quantityPriceBreaks,
}: {
  quantityPriceBreaks?: QuantityPriceBreak[];
}) {
  return quantityPriceBreaks?.length ? (
    <div className="mt-4 [&_table]:relative [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:overflow-x-auto [&_table]:border [&_table]:border-border [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:text-left [&_td]:align-top [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-sm [&_th]:font-normal [&_thead]:bg-neutral-300 [&_thead_th]:font-bold">
      <h4 className="mb-2 text-base font-bold">Volume Pricing</h4>
      <table>
        <thead>
          <tr>
            <th>Minimum Quantity</th>
            <th>Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {quantityPriceBreaks.map((priceBreak, index) => {
            return (
              <tr key={index}>
                <th>{priceBreak.minimumQuantity}</th>
                <th>
                  <Money data={priceBreak.price} />
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : null;
}
