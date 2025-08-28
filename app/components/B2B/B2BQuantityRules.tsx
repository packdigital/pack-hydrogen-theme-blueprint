import type {QuantityRule} from '@shopify/hydrogen/storefront-api-types';

/**
 * @example
 * ```tsx
 *  <B2BQuantityRules
 *    quantityRule={selectedVariant?.quantityRule}
 *  />
 * ```
 */

export function B2BQuantityRules({
  quantityRule,
}: {
  quantityRule?: QuantityRule;
}) {
  const {increment, minimum, maximum} = {...quantityRule};

  return increment !== 1 || minimum !== 1 || maximum ? (
    <div className="mt-4 [&_table]:relative [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:overflow-x-auto [&_table]:border [&_table]:border-border [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:text-left [&_td]:align-top [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-sm [&_th]:font-normal [&_thead]:bg-neutral-300 [&_thead_th]:font-bold">
      <h4 className="mb-2 text-base font-bold">Quantity Rules</h4>
      <table>
        <thead>
          <tr>
            <th>Increment</th>
            <th>Minimum</th>
            <th>Maximum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{increment}</th>
            <th>{minimum}</th>
            <th>{maximum || 'None'}</th>
          </tr>
        </tbody>
      </table>
    </div>
  ) : null;
}
