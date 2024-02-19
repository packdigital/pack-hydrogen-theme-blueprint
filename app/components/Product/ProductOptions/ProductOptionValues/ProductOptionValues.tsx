import type {ProductWithGrouping} from '~/lib/types';

import {ProductOptionValuesLabel} from '../ProductOptionValuesLabel';

import {ProductOptionValue} from './ProductOptionValue';

interface ProductOptionValueProps {
  name: string;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  values: string[];
}

export function ProductOptionValues({
  name,
  product,
  selectedOptionsMap,
  setSelectedOption,
  values,
}: ProductOptionValueProps) {
  const productOrGroupingValues = product.isGrouped
    ? product.grouping?.optionsMap?.[name]
    : values;

  return (
    <div>
      <ProductOptionValuesLabel
        name={name}
        selectedValue={selectedOptionsMap?.[name]}
      />

      <ul className="flex flex-wrap gap-2">
        {productOrGroupingValues?.map((value) => {
          const isSelected = selectedOptionsMap?.[name] === value;

          return (
            <li key={value}>
              <ProductOptionValue
                isSelected={isSelected}
                name={name}
                product={product}
                selectedOptionsMap={selectedOptionsMap}
                setSelectedOption={setSelectedOption}
                value={value}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

ProductOptionValues.displayName = 'ProductOptionValues';
