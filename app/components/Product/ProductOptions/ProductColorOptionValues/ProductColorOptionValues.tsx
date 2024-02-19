import {useEffect, useMemo, useState} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {OptionWithGroups, ProductWithGrouping} from '~/lib/types';

import {ProductOptionValuesLabel} from '../ProductOptionValuesLabel';

import {ProductColorOptionValue} from './ProductColorOptionValue';

interface ProductColorOptionValuesProps {
  name: string;
  product: ProductWithGrouping;
  selectedOptionsMap: Record<string, string>;
  setSelectedOption: (name: string, value: string) => void;
}

export function ProductColorOptionValues({
  product,
  name,
  selectedOptionsMap,
  setSelectedOption,
}: ProductColorOptionValuesProps) {
  const [groupingProductsMapByColor, setGroupingProductsMapByColor] =
    useState<Record<string, Product> | null>(null);

  const colorOptions = useMemo((): OptionWithGroups | undefined => {
    return product.isGrouped
      ? product.grouping?.options?.find(
          (option) => option.name === COLOR_OPTION_NAME,
        )
      : product.options.find((option) => option.name === COLOR_OPTION_NAME);
  }, [product]);

  useEffect(() => {
    if (!product?.isGrouped) return;

    const groupingProductsMap = Object.values({
      ...product.grouping?.productsMap,
    }).reduce((acc: Record<string, ProductWithGrouping>, groupProduct) => {
      const color = groupProduct.options.find(
        (option) => option.name === COLOR_OPTION_NAME,
      )?.values?.[0];
      if (!color) return acc;
      return {
        ...acc,
        [color]: groupProduct,
      };
    }, {});

    setGroupingProductsMapByColor(groupingProductsMap);
  }, [product?.id]);

  return (
    <div>
      {!!colorOptions?.hasSubgroups && (
        <div className="flex flex-col gap-2">
          {colorOptions?.groups?.map((group, index) => {
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
                    const isSelected = selectedColor === value;

                    return (
                      <li key={value}>
                        <ProductColorOptionValue
                          groupingProductsMapByColor={
                            groupingProductsMapByColor
                          }
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
          })}
        </div>
      )}

      {!colorOptions?.hasSubgroups && (
        <>
          <ProductOptionValuesLabel
            name={name}
            selectedValue={selectedOptionsMap?.[name]}
          />

          <ul className="flex flex-wrap gap-2">
            {colorOptions?.values.map((value) => {
              const isSelected = selectedOptionsMap?.[name] === value;

              return (
                <li key={value}>
                  <ProductColorOptionValue
                    groupingProductsMapByColor={groupingProductsMapByColor}
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
        </>
      )}
    </div>
  );
}

ProductColorOptionValues.displayName = 'ProductColorOptionValues';
