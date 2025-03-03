import {useEffect, useMemo, useState} from 'react';
import {useLocation} from '@remix-run/react';

import type {OptionWithGroups} from '~/lib/types';

import {ProductOptionValuesLabel} from './ProductOptionValuesLabel';
import {ProductOptionValue} from './ProductOptionValue';
import type {ProductOptionValuesProps} from './ProductOptions.types';

export function ProductOptionValues({
  isModalProduct,
  onSelect,
  option: initialOption,
  product,
  selectedOptionsMap,
  setSelectedOption,
  swatchesMap,
}: ProductOptionValuesProps) {
  const {pathname} = useLocation();

  /*
   * optimisticSelectedIndex is used to visually select an option value that
   * navigates to a new product before the new page is loaded
   */
  const [optimisticSelectedIndex, setOptimisticSelectedIndex] =
    useState<number>(-1);

  const option = useMemo((): OptionWithGroups | undefined => {
    return product.grouping
      ? product.grouping.options?.find(
          (option) => option.name === initialOption.name,
        )
      : initialOption;
  }, [product]);

  useEffect(() => {
    // reset optimisticSelectedIndex after navigation
    if (optimisticSelectedIndex > -1) {
      setOptimisticSelectedIndex(-1);
    }
  }, [pathname]);

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
                  {group.optionValues.map((optionValue, index) => {
                    return (
                      <li key={optionValue.name}>
                        <ProductOptionValue
                          index={index}
                          isModalProduct={isModalProduct}
                          name={name}
                          optimisticSelectedIndex={optimisticSelectedIndex}
                          product={product}
                          selectedOptionsMap={selectedOptionsMap}
                          setOptimisticSelectedIndex={
                            setOptimisticSelectedIndex
                          }
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
            {optionValues?.map((optionValue, index) => {
              return (
                <li key={optionValue.name}>
                  <ProductOptionValue
                    index={index}
                    isModalProduct={isModalProduct}
                    name={name}
                    optimisticSelectedIndex={optimisticSelectedIndex}
                    product={product}
                    selectedOptionsMap={selectedOptionsMap}
                    setOptimisticSelectedIndex={setOptimisticSelectedIndex}
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
