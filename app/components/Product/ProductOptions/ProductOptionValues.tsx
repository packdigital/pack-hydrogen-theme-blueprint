import {useMemo} from 'react';

import type {
  OptionWithGroups,
  ProductWithGrouping,
  SwatchesMap,
} from '~/lib/types';

import {ProductOptionValuesLabel} from './ProductOptionValuesLabel';
import {ProductOptionValue} from './ProductOptionValue';

interface ProductOptionValueProps {
  option: OptionWithGroups;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  swatchesMap: SwatchesMap;
}

export function ProductOptionValues({
  option: initialOption,
  product,
  selectedOptionsMap,
  setSelectedOption,
  swatchesMap,
}: ProductOptionValueProps) {
  const option = useMemo((): OptionWithGroups | undefined => {
    return product.grouping
      ? product.grouping.options?.find(
          (option) => option.name === initialOption.name,
        )
      : initialOption;
  }, [product]);

  const hasSubgroups = !!option?.hasSubgroups;
  const {name = '', values} = {...option};

  return (
    <div>
      {hasSubgroups && (
        <div className="flex flex-col gap-2">
          {option?.groups?.map((group, index) => {
            if (!group.values.length) return null;

            const selectedColor = selectedOptionsMap?.[name];
            const groupHasSelectedColor = group.values.includes(selectedColor);

            return (
              <div key={index}>
                <ProductOptionValuesLabel
                  name={group.name}
                  selectedValue={groupHasSelectedColor ? selectedColor : null}
                />

                <ul className="flex flex-wrap gap-2">
                  {group.values.map((value) => {
                    return (
                      <li key={value}>
                        <ProductOptionValue
                          name={name}
                          product={product}
                          selectedOptionsMap={selectedOptionsMap}
                          setSelectedOption={setSelectedOption}
                          swatchesMap={swatchesMap}
                          value={value}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {!hasSubgroups && (
        <>
          <ProductOptionValuesLabel
            name={name}
            selectedValue={selectedOptionsMap?.[name]}
          />

          <ul className="flex flex-wrap gap-2">
            {values?.map((value) => {
              return (
                <li key={value}>
                  <ProductOptionValue
                    name={name}
                    product={product}
                    selectedOptionsMap={selectedOptionsMap}
                    setSelectedOption={setSelectedOption}
                    swatchesMap={swatchesMap}
                    value={value}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

ProductOptionValues.displayName = 'ProductOptionValues';
