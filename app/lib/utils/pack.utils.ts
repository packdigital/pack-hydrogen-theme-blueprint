import type {Product} from '@shopify/hydrogen/storefront-api-types';

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

  let parentGroupOptionsMap: Record<string, string[]> = {};
  if (hasParentGroupWithProducts) {
    parentGroupOptionsMap = parentGroupProducts.reduce(
      (acc: Record<string, string[]>, {options}) => {
        options?.forEach(({name, values}) => {
          if (name === COLOR_OPTION_NAME && !hasColorOption)
            hasColorOption = true;
          if (!acc[name]) {
            acc[name] = values;
          } else {
            acc[name] = [...new Set([...acc[name], ...values])];
          }
        });
        return acc;
      },
      {},
    );
  }

  let subGroupOptionsMapsByIndex: Record<string, Record<string, string[]>> = {};
  if (hasSubgroupsWithProducts) {
    subGroupOptionsMapsByIndex = Object.entries(subGroupProductsByIndex).reduce(
      (acc, [sgIndex, sgProducts]) => {
        const subGroupOptions = sgProducts.reduce(
          (sgAcc: Record<string, string[]>, {options}) => {
            options?.forEach(({name, values}) => {
              if (name === COLOR_OPTION_NAME && !hasColorOption)
                hasColorOption = true;
              if (!sgAcc[name]) {
                sgAcc[name] = values;
              } else {
                sgAcc[name] = [...new Set([...sgAcc[name], ...values])];
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
    Object.entries(parentGroupOptionsMap).forEach(([name, values]) => {
      combinedGroupOptionsInitialMap[name] = {values} as OptionWithGroups;
      if (name === groupingOptionName && hasSubgroupsWithProducts) {
        combinedGroupOptionsInitialMap[name].groups = [
          {
            name, // customize parent option name if desired, e.g. "Primary"
            values,
          },
        ];
      }
    });
  }
  if (hasSubgroupsWithProducts) {
    Object.entries(subGroupOptionsMapsByIndex).forEach(
      ([subgroupIndex, subGroupOptions]) => {
        Object.entries(subGroupOptions).forEach(([name, values]) => {
          if (!combinedGroupOptionsInitialMap[name]) {
            combinedGroupOptionsInitialMap[name] = {values} as OptionWithGroups;
          } else {
            combinedGroupOptionsInitialMap[name].values = [
              ...new Set([
                ...combinedGroupOptionsInitialMap[name].values,
                ...values,
              ]),
            ];
          }
          if (name === groupingOptionName) {
            combinedGroupOptionsInitialMap[name].groups = [
              ...(combinedGroupOptionsInitialMap[name].groups || []),
              {
                name: grouping.subgroups[Number(subgroupIndex)].title,
                values,
              },
            ];
          }
        });
      },
    );
  }

  const combinedGroupOptions = Object.entries(
    combinedGroupOptionsInitialMap,
  ).map(([name, {values, groups}]) => {
    return {
      name,
      values,
      ...(groups && {groups, hasSubgroups: true}),
    };
  });

  const combinedGroupOptionsMap = combinedGroupOptions.reduce(
    (acc: Record<string, string[]>, {name, values}) => {
      acc[name] = values;
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
