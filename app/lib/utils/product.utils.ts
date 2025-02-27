import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {PRODUCT_METAFIELDS_IDENTIFIERS} from '~/lib/constants';
import type {MetafieldIdentifier, ParsedMetafields} from '~/lib/types';

export const parseMetafieldsFromProduct = ({
  product,
  identifiers,
}: {
  product: Product;
  identifiers?: MetafieldIdentifier[];
}) => {
  if (!product.metafields) return {};
  return product.metafields.reduce(
    (acc: ParsedMetafields, metafield, index) => {
      if (!metafield) {
        if (!identifiers?.length) return acc;
        const query = identifiers[index];
        acc[`${query.namespace ? `${query.namespace}.` : ''}${query.key}`] =
          metafield;
        return acc;
      }
      acc[
        `${metafield.namespace ? `${metafield.namespace}.` : ''}${
          metafield.key
        }`
      ] = metafield;
      return acc;
    },
    {},
  );
};

export const normalizeAdminProduct = (adminProduct: any) => {
  if (!adminProduct) return null;

  const currencyCode = adminProduct.priceRange?.maxVariantPrice?.currencyCode;

  const metafieldsByIdentifier = adminProduct.metafields?.nodes?.reduce(
    (acc, metafield) => {
      const {namespace, key} = metafield;
      return {
        ...acc,
        [`${namespace ? `${namespace}.` : ''}${key}`]: metafield,
      };
    },
    {},
  );

  const metafields = PRODUCT_METAFIELDS_IDENTIFIERS.map(({namespace, key}) => {
    return (
      metafieldsByIdentifier[`${namespace ? `${namespace}.` : ''}${key}`] ||
      null
    );
  });

  return {
    ...adminProduct,
    featuredImage: adminProduct.featuredImage?.preview?.image || null,
    media: {
      nodes: adminProduct.media?.nodes?.map((media) => {
        return {
          alt: media.alt,
          id: media.id,
          mediaContentType: media.mediaContentType,
          previewImage: media.preview?.image || null,
        };
      }),
    },
    metafields,
    sellingPlanGroups: {
      nodes:
        adminProduct.sellingPlanGroups?.nodes?.slice(0, 1).map((group) => {
          return {
            id: group.id,
            name: group.name,
            appName: group.appId,
            options:
              group.options?.map((optionName, index) => {
                return {
                  name: optionName,
                  values: [
                    group.sellingPlans?.nodes?.[0]?.options?.[index] || '',
                  ].filter(Boolean),
                };
              }) || [],
            sellingPlans: {
              nodes:
                group.sellingPlans?.nodes?.slice(0, 1).map((sellingPlan) => {
                  return {
                    id: sellingPlan.id,
                    name: sellingPlan.name,
                    description: sellingPlan.description,
                    options:
                      group.options?.map((optionName, index) => {
                        return {
                          name: optionName,
                          value:
                            group.sellingPlans?.nodes?.[0]?.options?.[index] ||
                            '',
                        };
                      }) || [],
                    recurringDeliveries: !!(
                      sellingPlan.deliveryPolicy?.fixedIntent ||
                      sellingPlan.deliveryPolicy?.recurringIntent
                    ),
                    priceAdjustments: sellingPlan.pricingPolicies?.map(
                      (policy) => {
                        return {
                          adjustmentValue:
                            policy.adjustmentType === 'PERCENTAGE'
                              ? {
                                  adjustmentPercentage:
                                    policy.adjustmentValue?.percentage || 0,
                                }
                              : policy.adjustmentType === 'FIXED_AMOUNT'
                              ? {
                                  adjustmentAmount: {
                                    amount: policy.adjustmentValue?.amount || 0,
                                    currencyCode:
                                      policy.adjustmentValue?.currencyCode,
                                  },
                                }
                              : policy.adjustmentType === 'PRICE'
                              ? {
                                  price: {
                                    amount: policy.adjustmentValue?.amount || 0,
                                    currencyCode:
                                      policy.adjustmentValue?.currencyCode,
                                  },
                                }
                              : {},
                        };
                      },
                    ),
                  };
                }) || [],
            },
          };
        }) || [],
    },
    tags: [
      ...(adminProduct.status === 'DRAFT' ? ['badge::Draft'] : []),
      ...(adminProduct.tags || []),
    ],
    variants: {
      nodes:
        adminProduct.variants?.nodes?.map((variant) => {
          return {
            ...variant,
            price: {
              amount: variant.price,
              currencyCode,
            },
            compareAtPrice: {
              amount: variant.compareAtPrice,
              currencyCode,
            },
            sellingPlanAllocations: {
              nodes:
                variant.sellingPlanAllocations?.nodes
                  ?.slice(0, 1)
                  .map((group) => {
                    const productsCount = group.productsCount?.count || 1;
                    const sellingPlan = group.sellingPlans?.nodes?.[0] || {};
                    const options =
                      sellingPlan.options?.map((optionName, index) => {
                        return {
                          name: optionName,
                          value:
                            group.sellingPlans?.nodes?.[0]?.options?.[index] ||
                            '',
                        };
                      }) || [];
                    return {
                      sellingPlan: {
                        id: sellingPlan.id,
                        name: sellingPlan.name,
                        description: sellingPlan.description,
                        options,
                        recurringDeliveries: !!(
                          sellingPlan.deliveryPolicy?.fixedIntent ||
                          sellingPlan.deliveryPolicy?.recurringIntent
                        ),
                        priceAdjustments: sellingPlan.pricingPolicies?.map(
                          (policy) => {
                            return {
                              adjustmentValue:
                                policy.adjustmentType === 'PERCENTAGE'
                                  ? {
                                      adjustmentPercentage:
                                        policy.adjustmentValue?.percentage ||
                                        '0.0',
                                    }
                                  : policy.adjustmentType === 'FIXED_AMOUNT'
                                  ? {
                                      adjustmentAmount: {
                                        amount:
                                          policy.adjustmentValue?.amount ||
                                          '0.0',
                                        currencyCode:
                                          policy.adjustmentValue?.currencyCode,
                                      },
                                    }
                                  : policy.adjustmentType === 'PRICE'
                                  ? {
                                      price: {
                                        amount:
                                          policy.adjustmentValue?.amount ||
                                          variant.price,
                                        currencyCode:
                                          policy.adjustmentValue?.currencyCode,
                                      },
                                    }
                                  : {},
                            };
                          },
                        ),
                      },
                      priceAdjustments:
                        sellingPlan.pricingPolicies?.map((policy) => {
                          const variantPriceNum = Number(variant.price);
                          return {
                            compareAtPrice: {
                              amount: variant.price,
                              currencyCode,
                            },
                            price: {
                              amount:
                                policy.adjustmentType === 'PERCENTAGE'
                                  ? (
                                      ((100 -
                                        (policy.adjustmentValue?.percentage ??
                                          0)) /
                                        100) *
                                      (variantPriceNum * productsCount)
                                    ).toFixed(2)
                                  : policy.adjustmentType === 'FIXED_AMOUNT'
                                  ? (
                                      variantPriceNum * productsCount -
                                      Number(
                                        policy.adjustmentValue?.amount ?? 0,
                                      ) *
                                        productsCount
                                    ).toFixed(2)
                                  : policy.adjustmentType === 'PRICE'
                                  ? (
                                      Number(
                                        policy.adjustmentValue?.amount ||
                                          variant.price,
                                      ) * productsCount
                                    ).toFixed(2)
                                  : (variantPriceNum * productsCount).toFixed(
                                      2,
                                    ),
                              currencyCode,
                            },
                            perDeliveryPrice: {
                              amount:
                                policy.adjustmentType === 'PERCENTAGE'
                                  ? (
                                      ((100 -
                                        (policy.adjustmentValue?.percentage ??
                                          0)) /
                                        100) *
                                      variantPriceNum
                                    ).toFixed(2)
                                  : policy.adjustmentType === 'FIXED_AMOUNT'
                                  ? (
                                      variantPriceNum -
                                      Number(
                                        policy.adjustmentValue?.amount ?? 0,
                                      )
                                    ).toFixed(2)
                                  : policy.adjustmentType === 'PRICE'
                                  ? policy.adjustmentValue?.amount ||
                                    variant.price
                                  : variant.price,
                              currencyCode,
                            },
                          };
                        }) || [],
                    };
                  }) || [],
            },
          };
        }) || [],
    },
  };
};
