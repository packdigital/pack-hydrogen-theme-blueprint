import {useMemo} from 'react';

import type {
  OptionWithGroups,
  ProductWithGrouping,
  SwatchesMap,
} from '~/lib/types';

import {ProductOptionValuesLabel} from './ProductOptionValuesLabel';
import {ProductOptionValue} from './ProductOptionValue';
import type {OnSelect} from './ProductOptions';

interface ProductOptionValueProps {
  onSelect?: OnSelect;
  option: OptionWithGroups;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
  swatchesMap: SwatchesMap;
}

export function ProductOptionValues({
  onSelect,
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
  const {name = '', optionValues} = {...option};

  return (
    <div>
      {hasSubgroups && (
        <div className="flex flex-col gap-2">
          {option?.groups?.map((group, index) => {
            if (!group.optionValues.length) return null;

            const selectedColor = selectedOptionsMap?.[name];
            const groupHasSelectedColor = group.optionValues.some(
              (optionValue) => optionValue.name === selectedColor,
            );

            return (
              <div key={index}>
                <ProductOptionValuesLabel
                  name={group.name}
                  selectedValue={groupHasSelectedColor ? selectedColor : null}
                />

                <ul className="flex flex-wrap gap-2">
                  {group.optionValues.map((optionValue) => {
                    return (
                      <li key={optionValue.name}>
                        <ProductOptionValue
                          name={name}
                          product={product}
                          selectedOptionsMap={selectedOptionsMap}
                          setSelectedOption={setSelectedOption}
                          swatchesMap={swatchesMap}
                          optionValue={optionValue}
                          onSelect={onSelect}
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
            {optionValues?.map((optionValue) => {
              return (
                <li key={optionValue.name}>
                  <ProductOptionValue
                    name={name}
                    product={product}
                    selectedOptionsMap={selectedOptionsMap}
                    setSelectedOption={setSelectedOption}
                    swatchesMap={swatchesMap}
                    optionValue={optionValue}
                    onSelect={onSelect}
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
