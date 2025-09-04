import type {
  Product,
  ProductOptionValue,
} from '@shopify/hydrogen/storefront-api-types';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {Group, OptionWithGroups} from '~/lib/types';

export const formatGroupingWithOptions = ({
  grouping,
  getProductByHandle,
}: {
  grouping: Group;
  getProductByHandle: (handle: string) => any;
}) => {
  if (
    (!grouping?.products?.length && !grouping?.subgroups?.length) ||
    !getProductByHandle
  )
    return null;

  let validParentGroupProductHandles: {handle: string}[] = [];
  if (grouping.products.length > 0) {
    validParentGroupProductHandles = grouping.products.reduce(
      (acc: {handle: string}[], {handle}) => {
        if (!getProductByHandle(handle)) return acc;
        return [...acc, {handle}];
      },
      [],
    );
  }
  const hasParentGroupWithProducts = validParentGroupProductHandles.length > 0;

  let validSubgroupProductHandlesByIndex: Record<string, {handle: string}[]> =
    {};
  if (grouping.subgroups?.length > 0) {
    validSubgroupProductHandlesByIndex = grouping.subgroups.reduce(
      (sgAcc: Record<string, {handle: string}[]>, subgroup, sgIndex) => {
        if (!subgroup.products?.length) return sgAcc;
        const validHandles = subgroup.products.reduce(
          (acc: {handle: string}[], {handle}) => {
            if (!getProductByHandle(handle)) return acc;
            return [...acc, {handle}];
          },
          [],
        );
        return {...sgAcc, [sgIndex]: validHandles};
      },
      {},
    );
  }
  const hasSubgroupsWithProducts = Object.values(
    validSubgroupProductHandlesByIndex,
  ).some((handles) => handles.length > 0);

  let subGroupProductsByIndex: Record<string, Product[]> = {};
  if (hasSubgroupsWithProducts) {
    subGroupProductsByIndex = Object.entries(
      validSubgroupProductHandlesByIndex,
    ).reduce((acc, [sgIndex, handles]) => {
      return {
        ...acc,
        [sgIndex]: handles.map(({handle}) => getProductByHandle(handle)),
      };
    }, {});
  }

  const parentGroupProducts: Product[] = validParentGroupProductHandles.map(
    ({handle}) => {
      return getProductByHandle(handle);
    },
  );

  let hasColorOption = false;

  let parentGroupOptionsMap: Record<string, ProductOptionValue[]> = {};
  if (hasParentGroupWithProducts) {
    parentGroupOptionsMap = parentGroupProducts.reduce(
      (acc: Record<string, ProductOptionValue[]>, {options}) => {
        options?.forEach(({name, optionValues}) => {
          if (name === COLOR_OPTION_NAME && !hasColorOption)
            hasColorOption = true;
          if (!acc[name]) {
            acc[name] = optionValues;
          } else {
            const newOptionValues = [...acc[name], ...optionValues];
            const newOptionValuesMap = newOptionValues.reduce(
              (ovAcc, value) => {
                return {...ovAcc, [value.name]: value};
              },
              {},
            );
            acc[name] = Object.values(newOptionValuesMap);
          }
        });
        return acc;
      },
      {},
    );
  }

  let subGroupOptionsMapsByIndex: Record<
    string,
    Record<string, ProductOptionValue[]>
  > = {};
  if (hasSubgroupsWithProducts) {
    subGroupOptionsMapsByIndex = Object.entries(subGroupProductsByIndex).reduce(
      (acc, [sgIndex, sgProducts]) => {
        const subGroupOptions = sgProducts.reduce(
          (sgAcc: Record<string, ProductOptionValue[]>, {options}) => {
            options?.forEach(({name, optionValues}) => {
              if (name === COLOR_OPTION_NAME && !hasColorOption)
                hasColorOption = true;
              if (!sgAcc[name]) {
                sgAcc[name] = optionValues;
              } else {
                const newOptionValues = [...sgAcc[name], ...optionValues];
                const newOptionValuesMap = newOptionValues.reduce(
                  (ovAcc, value) => {
                    return {...ovAcc, [value.name]: value};
                  },
                  {},
                );
                sgAcc[name] = Object.values(newOptionValuesMap);
              }
            });
            return sgAcc;
          },
          {},
        );

        return {
          ...acc,
          [sgIndex]: subGroupOptions,
        };
      },
      {},
    );
  }

  // by default break up subgroups based on color option
  let groupingOptionName: string = COLOR_OPTION_NAME;
  // if there are no color options, use the first option from the first product
  if (!hasColorOption) {
    const parentProductFirstOptionName =
      parentGroupProducts[0]?.options?.[0]?.name;
    const subGroupFirstProductFirstOptionName =
      subGroupProductsByIndex?.['0']?.[0]?.options?.[0]?.name;
    groupingOptionName =
      parentProductFirstOptionName ||
      subGroupFirstProductFirstOptionName ||
      COLOR_OPTION_NAME;
  }

  const combinedGroupOptionsInitialMap: Record<string, OptionWithGroups> = {};
  if (hasParentGroupWithProducts) {
    Object.entries(parentGroupOptionsMap).forEach(([name, optionValues]) => {
      combinedGroupOptionsInitialMap[name] = {optionValues} as OptionWithGroups;
      if (name === groupingOptionName && hasSubgroupsWithProducts) {
        combinedGroupOptionsInitialMap[name].groups = [
          {
            name, // customize parent option name if desired, e.g. "Primary"
            optionValues,
          },
        ];
      }
    });
  }
  if (hasSubgroupsWithProducts) {
    Object.entries(subGroupOptionsMapsByIndex).forEach(
      ([subgroupIndex, subGroupOptions]) => {
        Object.entries(subGroupOptions).forEach(([name, optionValues]) => {
          if (!combinedGroupOptionsInitialMap[name]) {
            combinedGroupOptionsInitialMap[name] = {
              optionValues,
            } as OptionWithGroups;
          } else {
            const newOptionValues = [
              ...combinedGroupOptionsInitialMap[name].optionValues,
              ...optionValues,
            ];
            const newOptionValuesMap = newOptionValues.reduce(
              (ovAcc, value) => {
                return {...ovAcc, [value.name]: value};
              },
              {},
            );
            combinedGroupOptionsInitialMap[name].optionValues =
              Object.values(newOptionValuesMap);
          }
          if (name === groupingOptionName) {
            combinedGroupOptionsInitialMap[name].groups = [
              ...(combinedGroupOptionsInitialMap[name].groups || []),
              {
                name: grouping.subgroups[Number(subgroupIndex)].title,
                optionValues,
              },
            ];
          }
        });
      },
    );
  }

  const combinedGroupOptions = Object.entries(
    combinedGroupOptionsInitialMap,
  ).map(([name, {optionValues, groups}]) => {
    return {
      name,
      optionValues,
      ...(groups && {groups, hasSubgroups: true}),
    };
  });

  const combinedGroupOptionsMap = combinedGroupOptions.reduce(
    (acc: Record<string, ProductOptionValue[]>, {name, optionValues}) => {
      acc[name] = optionValues;
      return acc;
    },
    {},
  );

  const updatedSubgroups = hasSubgroupsWithProducts
    ? grouping.subgroups.map((subgroup: any, index: number) => {
        return {
          ...subgroup,
          products: validSubgroupProductHandlesByIndex[index] || [],
        };
      })
    : [];

  return {
    ...grouping,
    options: combinedGroupOptions,
    optionsMap: combinedGroupOptionsMap,
    allProducts: [
      ...validParentGroupProductHandles,
      ...updatedSubgroups.flatMap(({products}) => products),
    ],
    products: validParentGroupProductHandles,
    subgroups: updatedSubgroups,
  };
};