import {useLocation} from '@remix-run/react';
import type {ProductOptionValuesProps} from 'modules/brilliant/Product/ProductOptions/ProductOptions.types';
import {useEffect, useMemo, useState} from 'react';

import {ProductOptionValue} from './ProductOptionValue/ProductOptionValue';

import {ProductOptionValuesLabel} from '~/components/Product/ProductOptions/ProductOptionValuesLabel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';
import type {OptionWithGroups} from '~/lib/types';

export function ProductOptionValues({
  isModalProduct,
  onSelect,
  option: initialOption,
  product,
  selectedOptionsMap,
  setSelectedOption,
  swatchesMap,
  optionsImageVariantMap,
}: ProductOptionValuesProps) {
  const {pathname} = useLocation();

  /*
   * optimisticSelectedIndex is used to visually select an option value that
   * navigates to a new product before the new page is loaded
   */
  const [optimisticSelectedIndex, setOptimisticSelectedIndex] =
    useState<number>(-1);
  const [optimisticSelectedSubgroupIndex, setOptimisticSelectedSubgroupIndex] =
    useState<number>(0);

  const option = useMemo((): OptionWithGroups | undefined => {
    return product.grouping
      ? product.grouping.options?.find(
          (option) => option.name === initialOption.name,
        )
      : initialOption;
  }, [initialOption, product.grouping]);

  useEffect(() => {
    // reset optimisticSelectedIndex and optimisticSelectedSubgroupIndex after navigation
    if (optimisticSelectedIndex > -1) {
      setOptimisticSelectedIndex(-1);
    }
    if (optimisticSelectedSubgroupIndex > 0) {
      setOptimisticSelectedSubgroupIndex(0);
    }
  }, [optimisticSelectedIndex, optimisticSelectedSubgroupIndex, pathname]);

  const hasSubgroups = !!option?.hasSubgroups;
  const {name = '', optionValues} = {...option};

  const hasOptionImageVariantMap = useMemo(
    () =>
      optionsImageVariantMap
        ? Object.keys(optionsImageVariantMap).length > 0
        : false,
    [optionsImageVariantMap],
  );

  return (
    <div>
      {hasSubgroups && (
        <div className="flex flex-col gap-2">
          {option?.groups?.map((group, groupIndex) => {
            if (!group.optionValues.length) return null;

            const selectedColor = selectedOptionsMap?.[name];
            const groupHasSelectedColor = group.optionValues.some(
              (optionValue) => optionValue.name === selectedColor,
            );

            return (
              <div key={groupIndex}>
                <ProductOptionValuesLabel
                  name={group.name}
                  selectedValue={groupHasSelectedColor ? selectedColor : null}
                />

                <ul className="flex flex-wrap gap-2">
                  {group.optionValues.map((optionValue, optionValueIndex) => {
                    return (
                      <li key={optionValue.name}>
                        <ProductOptionValue
                          index={optionValueIndex}
                          isModalProduct={isModalProduct}
                          name={name}
                          onSelect={onSelect}
                          optimisticSelectedIndex={optimisticSelectedIndex}
                          optimisticSelectedSubgroupIndex={
                            optimisticSelectedSubgroupIndex
                          }
                          optionValue={optionValue}
                          product={product}
                          selectedOptionsMap={selectedOptionsMap}
                          setOptimisticSelectedIndex={
                            setOptimisticSelectedIndex
                          }
                          setOptimisticSelectedSubgroupIndex={
                            setOptimisticSelectedSubgroupIndex
                          }
                          setSelectedOption={setSelectedOption}
                          subgroupIndex={groupIndex}
                          swatchesMap={swatchesMap}
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

      {!hasSubgroups && !hasOptionImageVariantMap && (
        <>
          <ProductOptionValuesLabel
            name={name}
            selectedValue={selectedOptionsMap?.[name]}
          />
          <ul className="flex flex-wrap justify-center gap-2">
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
                    optionsImageVariantMap={optionsImageVariantMap}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}

      {!hasSubgroups && hasOptionImageVariantMap && (
        <div className="">
          <ProductOptionValuesLabel
            name={name}
            selectedValue={selectedOptionsMap?.[name]}
          />
          <div className="mx-2">
            <Carousel
              className=""
              opts={{
                align: 'start',
                loop: true,
              }}
            >
              <CarouselContent className="mx-0 px-5 py-4">
                {optionValues?.map((optionValue, index) => {
                  return (
                    <CarouselItem
                      key={optionValue.name}
                      className="basis-1/3 px-1 md:basis-1/2 lg:basis-1/3"
                    >
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
                        optionsImageVariantMap={optionsImageVariantMap}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="mt-2 flex w-full items-center justify-center gap-6">
                <CarouselPrevious className="" variant="default" />
                <div className="text-sm">Select A {name}</div>
                <CarouselNext className="" variant="default" />
              </div>
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}

ProductOptionValues.displayName = 'ProductOptionValues';
