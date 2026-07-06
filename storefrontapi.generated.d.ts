/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type CartLineFragmentFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  cost: {
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
    >;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountAllocations: Array<
    | ({__typename: 'CartAutomaticDiscountAllocation'} & Pick<
        StorefrontAPI.CartAutomaticDiscountAllocation,
        'title'
      > & {
          discountedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        })
    | ({__typename: 'CartCodeDiscountAllocation'} & Pick<
        StorefrontAPI.CartCodeDiscountAllocation,
        'code'
      > & {
          discountedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        })
    | ({__typename: 'CartCustomDiscountAllocation'} & Pick<
        StorefrontAPI.CartCustomDiscountAllocation,
        'title'
      > & {
          discountedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        })
  >;
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'availableForSale' | 'id' | 'sku' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
    >;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    product: Pick<
      StorefrontAPI.Product,
      'handle' | 'id' | 'productType' | 'tags' | 'title' | 'vendor'
    > & {
      collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<
                    | (Pick<
                        StorefrontAPI.ExternalVideo,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Model3d,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Video,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                  >;
                }
              >;
            }
          >;
        }
      >;
      images: {
        nodes: Array<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
      };
    };
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
    sellingPlanAllocations: {
      edges: Array<{
        node: {
          sellingPlan: Pick<
            StorefrontAPI.SellingPlan,
            'id' | 'name' | 'description' | 'recurringDeliveries'
          > & {
            options: Array<
              Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
            >;
            priceAdjustments: Array<
              Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
                adjustmentValue:
                  | {
                      adjustmentAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    }
                  | {
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    }
                  | Pick<
                      StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                      'adjustmentPercentage'
                    >;
              }
            >;
          };
          priceAdjustments: Array<{
            compareAtPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            perDeliveryPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }>;
        };
      }>;
    };
  };
};

export type CartLineComponentFragmentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  cost: {
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
    >;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountAllocations: Array<
    | ({__typename: 'CartAutomaticDiscountAllocation'} & Pick<
        StorefrontAPI.CartAutomaticDiscountAllocation,
        'title'
      > & {
          discountedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        })
    | ({__typename: 'CartCodeDiscountAllocation'} & Pick<
        StorefrontAPI.CartCodeDiscountAllocation,
        'code'
      > & {
          discountedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        })
    | ({__typename: 'CartCustomDiscountAllocation'} & Pick<
        StorefrontAPI.CartCustomDiscountAllocation,
        'title'
      > & {
          discountedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        })
  >;
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'availableForSale' | 'id' | 'sku' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
    >;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    product: Pick<
      StorefrontAPI.Product,
      'handle' | 'id' | 'productType' | 'tags' | 'title' | 'vendor'
    > & {
      collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<
                    | (Pick<
                        StorefrontAPI.ExternalVideo,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Model3d,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Video,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                  >;
                }
              >;
            }
          >;
        }
      >;
      images: {
        nodes: Array<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
      };
    };
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
    sellingPlanAllocations: {
      edges: Array<{
        node: {
          sellingPlan: Pick<
            StorefrontAPI.SellingPlan,
            'id' | 'name' | 'description' | 'recurringDeliveries'
          > & {
            options: Array<
              Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
            >;
            priceAdjustments: Array<
              Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
                adjustmentValue:
                  | {
                      adjustmentAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    }
                  | {
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    }
                  | Pick<
                      StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                      'adjustmentPercentage'
                    >;
              }
            >;
          };
          priceAdjustments: Array<{
            compareAtPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            perDeliveryPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }>;
        };
      }>;
    };
  };
  lineComponents: Array<
    Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
      cost: {
        amountPerQuantity: Pick<
          StorefrontAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        totalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
      discountAllocations: Array<
        | ({__typename: 'CartAutomaticDiscountAllocation'} & Pick<
            StorefrontAPI.CartAutomaticDiscountAllocation,
            'title'
          > & {
              discountedAmount: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            })
        | ({__typename: 'CartCodeDiscountAllocation'} & Pick<
            StorefrontAPI.CartCodeDiscountAllocation,
            'code'
          > & {
              discountedAmount: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            })
        | ({__typename: 'CartCustomDiscountAllocation'} & Pick<
            StorefrontAPI.CartCustomDiscountAllocation,
            'title'
          > & {
              discountedAmount: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            })
      >;
      merchandise: Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<
          StorefrontAPI.Product,
          'handle' | 'id' | 'productType' | 'tags' | 'title' | 'vendor'
        > & {
          collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
          options: Array<
            Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
              optionValues: Array<
                Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
                  swatch?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                      image?: StorefrontAPI.Maybe<
                        | (Pick<
                            StorefrontAPI.ExternalVideo,
                            'mediaContentType' | 'id' | 'alt'
                          > & {
                            previewImage?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'height' | 'id' | 'url' | 'width' | 'altText'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.MediaImage,
                            'mediaContentType' | 'id' | 'alt'
                          > & {
                            previewImage?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'height' | 'id' | 'url' | 'width' | 'altText'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Model3d,
                            'mediaContentType' | 'id' | 'alt'
                          > & {
                            previewImage?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'height' | 'id' | 'url' | 'width' | 'altText'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Video,
                            'mediaContentType' | 'id' | 'alt'
                          > & {
                            previewImage?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'height' | 'id' | 'url' | 'width' | 'altText'
                              >
                            >;
                          })
                      >;
                    }
                  >;
                }
              >;
            }
          >;
          images: {
            nodes: Array<
              Pick<
                StorefrontAPI.Image,
                'altText' | 'height' | 'id' | 'url' | 'width'
              >
            >;
          };
        };
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        sellingPlanAllocations: {
          edges: Array<{
            node: {
              sellingPlan: Pick<
                StorefrontAPI.SellingPlan,
                'id' | 'name' | 'description' | 'recurringDeliveries'
              > & {
                options: Array<
                  Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                >;
                priceAdjustments: Array<
                  Pick<
                    StorefrontAPI.SellingPlanPriceAdjustment,
                    'orderCount'
                  > & {
                    adjustmentValue:
                      | {
                          adjustmentAmount: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                        }
                      | {
                          price: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                        }
                      | Pick<
                          StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                          'adjustmentPercentage'
                        >;
                  }
                >;
              };
              priceAdjustments: Array<{
                compareAtPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                perDeliveryPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                unitPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
              }>;
            };
          }>;
        };
      };
    }
  >;
};

export type CartApiQueryFragment = {__typename: 'Cart'} & Pick<
  StorefrontAPI.Cart,
  'id' | 'checkoutUrl' | 'createdAt' | 'totalQuantity' | 'note' | 'updatedAt'
> & {
    buyerIdentity: Pick<
      StorefrontAPI.CartBuyerIdentity,
      'countryCode' | 'email' | 'phone'
    > & {
      customer?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.Customer,
          'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
        >
      >;
    };
    attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
    cost: {
      subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      totalAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    };
    discountAllocations: Array<
      | ({__typename: 'CartAutomaticDiscountAllocation'} & Pick<
          StorefrontAPI.CartAutomaticDiscountAllocation,
          'title'
        > & {
            discountedAmount: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          })
      | ({__typename: 'CartCodeDiscountAllocation'} & Pick<
          StorefrontAPI.CartCodeDiscountAllocation,
          'code'
        > & {
            discountedAmount: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          })
      | ({__typename: 'CartCustomDiscountAllocation'} & Pick<
          StorefrontAPI.CartCustomDiscountAllocation,
          'title'
        > & {
            discountedAmount: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          })
    >;
    discountCodes: Array<
      Pick<StorefrontAPI.CartDiscountCode, 'applicable' | 'code'>
    >;
    lines: {
      edges: Array<{
        node:
          | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
              cost: {
                amountPerQuantity: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                totalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                subtotalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
              };
              attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
              discountAllocations: Array<
                | ({__typename: 'CartAutomaticDiscountAllocation'} & Pick<
                    StorefrontAPI.CartAutomaticDiscountAllocation,
                    'title'
                  > & {
                      discountedAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    })
                | ({__typename: 'CartCodeDiscountAllocation'} & Pick<
                    StorefrontAPI.CartCodeDiscountAllocation,
                    'code'
                  > & {
                      discountedAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    })
                | ({__typename: 'CartCustomDiscountAllocation'} & Pick<
                    StorefrontAPI.CartCustomDiscountAllocation,
                    'title'
                  > & {
                      discountedAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    })
              >;
              merchandise: Pick<
                StorefrontAPI.ProductVariant,
                'availableForSale' | 'id' | 'sku' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                product: Pick<
                  StorefrontAPI.Product,
                  'handle' | 'id' | 'productType' | 'tags' | 'title' | 'vendor'
                > & {
                  collections: {
                    nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
                  };
                  options: Array<
                    Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
                      optionValues: Array<
                        Pick<
                          StorefrontAPI.ProductOptionValue,
                          'id' | 'name'
                        > & {
                          swatch?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.ProductOptionValueSwatch,
                              'color'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                | (Pick<
                                    StorefrontAPI.ExternalVideo,
                                    'mediaContentType' | 'id' | 'alt'
                                  > & {
                                    previewImage?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        | 'height'
                                        | 'id'
                                        | 'url'
                                        | 'width'
                                        | 'altText'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.MediaImage,
                                    'mediaContentType' | 'id' | 'alt'
                                  > & {
                                    previewImage?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        | 'height'
                                        | 'id'
                                        | 'url'
                                        | 'width'
                                        | 'altText'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Model3d,
                                    'mediaContentType' | 'id' | 'alt'
                                  > & {
                                    previewImage?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        | 'height'
                                        | 'id'
                                        | 'url'
                                        | 'width'
                                        | 'altText'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Video,
                                    'mediaContentType' | 'id' | 'alt'
                                  > & {
                                    previewImage?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        | 'height'
                                        | 'id'
                                        | 'url'
                                        | 'width'
                                        | 'altText'
                                      >
                                    >;
                                  })
                              >;
                            }
                          >;
                        }
                      >;
                    }
                  >;
                  images: {
                    nodes: Array<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'height' | 'id' | 'url' | 'width'
                      >
                    >;
                  };
                };
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                sellingPlanAllocations: {
                  edges: Array<{
                    node: {
                      sellingPlan: Pick<
                        StorefrontAPI.SellingPlan,
                        'id' | 'name' | 'description' | 'recurringDeliveries'
                      > & {
                        options: Array<
                          Pick<
                            StorefrontAPI.SellingPlanOption,
                            'name' | 'value'
                          >
                        >;
                        priceAdjustments: Array<
                          Pick<
                            StorefrontAPI.SellingPlanPriceAdjustment,
                            'orderCount'
                          > & {
                            adjustmentValue:
                              | {
                                  adjustmentAmount: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              | {
                                  price: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              | Pick<
                                  StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                                  'adjustmentPercentage'
                                >;
                          }
                        >;
                      };
                      priceAdjustments: Array<{
                        compareAtPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        perDeliveryPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        unitPrice?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                        >;
                      }>;
                    };
                  }>;
                };
              };
            })
          | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
              cost: {
                amountPerQuantity: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                totalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                subtotalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
              };
              attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
              discountAllocations: Array<
                | ({__typename: 'CartAutomaticDiscountAllocation'} & Pick<
                    StorefrontAPI.CartAutomaticDiscountAllocation,
                    'title'
                  > & {
                      discountedAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    })
                | ({__typename: 'CartCodeDiscountAllocation'} & Pick<
                    StorefrontAPI.CartCodeDiscountAllocation,
                    'code'
                  > & {
                      discountedAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    })
                | ({__typename: 'CartCustomDiscountAllocation'} & Pick<
                    StorefrontAPI.CartCustomDiscountAllocation,
                    'title'
                  > & {
                      discountedAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    })
              >;
              merchandise: Pick<
                StorefrontAPI.ProductVariant,
                'availableForSale' | 'id' | 'sku' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                product: Pick<
                  StorefrontAPI.Product,
                  'handle' | 'id' | 'productType' | 'tags' | 'title' | 'vendor'
                > & {
                  collections: {
                    nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
                  };
                  options: Array<
                    Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
                      optionValues: Array<
                        Pick<
                          StorefrontAPI.ProductOptionValue,
                          'id' | 'name'
                        > & {
                          swatch?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.ProductOptionValueSwatch,
                              'color'
                            > & {
                              image?: StorefrontAPI.Maybe<
                                | (Pick<
                                    StorefrontAPI.ExternalVideo,
                                    'mediaContentType' | 'id' | 'alt'
                                  > & {
                                    previewImage?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        | 'altText'
                                        | 'height'
                                        | 'id'
                                        | 'url'
                                        | 'width'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.MediaImage,
                                    'mediaContentType' | 'id' | 'alt'
                                  > & {
                                    previewImage?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        | 'altText'
                                        | 'height'
                                        | 'id'
                                        | 'url'
                                        | 'width'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Model3d,
                                    'mediaContentType' | 'id' | 'alt'
                                  > & {
                                    previewImage?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        | 'altText'
                                        | 'height'
                                        | 'id'
                                        | 'url'
                                        | 'width'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Video,
                                    'mediaContentType' | 'id' | 'alt'
                                  > & {
                                    previewImage?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        | 'altText'
                                        | 'height'
                                        | 'id'
                                        | 'url'
                                        | 'width'
                                      >
                                    >;
                                  })
                              >;
                            }
                          >;
                        }
                      >;
                    }
                  >;
                  images: {
                    nodes: Array<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'height' | 'id' | 'url' | 'width'
                      >
                    >;
                  };
                };
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                sellingPlanAllocations: {
                  edges: Array<{
                    node: {
                      sellingPlan: Pick<
                        StorefrontAPI.SellingPlan,
                        'id' | 'name' | 'description' | 'recurringDeliveries'
                      > & {
                        options: Array<
                          Pick<
                            StorefrontAPI.SellingPlanOption,
                            'name' | 'value'
                          >
                        >;
                        priceAdjustments: Array<
                          Pick<
                            StorefrontAPI.SellingPlanPriceAdjustment,
                            'orderCount'
                          > & {
                            adjustmentValue:
                              | {
                                  adjustmentAmount: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              | {
                                  price: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              | Pick<
                                  StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                                  'adjustmentPercentage'
                                >;
                          }
                        >;
                      };
                      priceAdjustments: Array<{
                        compareAtPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        perDeliveryPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        unitPrice?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                        >;
                      }>;
                    };
                  }>;
                };
              };
              lineComponents: Array<
                Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
                  cost: {
                    amountPerQuantity: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    totalAmount: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    subtotalAmount: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                  };
                  attributes: Array<
                    Pick<StorefrontAPI.Attribute, 'key' | 'value'>
                  >;
                  discountAllocations: Array<
                    | ({__typename: 'CartAutomaticDiscountAllocation'} & Pick<
                        StorefrontAPI.CartAutomaticDiscountAllocation,
                        'title'
                      > & {
                          discountedAmount: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                        })
                    | ({__typename: 'CartCodeDiscountAllocation'} & Pick<
                        StorefrontAPI.CartCodeDiscountAllocation,
                        'code'
                      > & {
                          discountedAmount: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                        })
                    | ({__typename: 'CartCustomDiscountAllocation'} & Pick<
                        StorefrontAPI.CartCustomDiscountAllocation,
                        'title'
                      > & {
                          discountedAmount: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                        })
                  >;
                  merchandise: Pick<
                    StorefrontAPI.ProductVariant,
                    'availableForSale' | 'id' | 'sku' | 'title'
                  > & {
                    compareAtPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'height' | 'id' | 'url' | 'width'
                      >
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    product: Pick<
                      StorefrontAPI.Product,
                      | 'handle'
                      | 'id'
                      | 'productType'
                      | 'tags'
                      | 'title'
                      | 'vendor'
                    > & {
                      collections: {
                        nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
                      };
                      options: Array<
                        Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
                          optionValues: Array<
                            Pick<
                              StorefrontAPI.ProductOptionValue,
                              'id' | 'name'
                            > & {
                              swatch?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.ProductOptionValueSwatch,
                                  'color'
                                > & {
                                  image?: StorefrontAPI.Maybe<
                                    | (Pick<
                                        StorefrontAPI.ExternalVideo,
                                        'mediaContentType' | 'id' | 'alt'
                                      > & {
                                        previewImage?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'altText'
                                            | 'height'
                                            | 'id'
                                            | 'url'
                                            | 'width'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.MediaImage,
                                        'mediaContentType' | 'id' | 'alt'
                                      > & {
                                        previewImage?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'altText'
                                            | 'height'
                                            | 'id'
                                            | 'url'
                                            | 'width'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Model3d,
                                        'mediaContentType' | 'id' | 'alt'
                                      > & {
                                        previewImage?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'altText'
                                            | 'height'
                                            | 'id'
                                            | 'url'
                                            | 'width'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Video,
                                        'mediaContentType' | 'id' | 'alt'
                                      > & {
                                        previewImage?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'altText'
                                            | 'height'
                                            | 'id'
                                            | 'url'
                                            | 'width'
                                          >
                                        >;
                                      })
                                  >;
                                }
                              >;
                            }
                          >;
                        }
                      >;
                      images: {
                        nodes: Array<
                          Pick<
                            StorefrontAPI.Image,
                            'altText' | 'height' | 'id' | 'url' | 'width'
                          >
                        >;
                      };
                    };
                    selectedOptions: Array<
                      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                    >;
                    sellingPlanAllocations: {
                      edges: Array<{
                        node: {
                          sellingPlan: Pick<
                            StorefrontAPI.SellingPlan,
                            | 'id'
                            | 'name'
                            | 'description'
                            | 'recurringDeliveries'
                          > & {
                            options: Array<
                              Pick<
                                StorefrontAPI.SellingPlanOption,
                                'name' | 'value'
                              >
                            >;
                            priceAdjustments: Array<
                              Pick<
                                StorefrontAPI.SellingPlanPriceAdjustment,
                                'orderCount'
                              > & {
                                adjustmentValue:
                                  | {
                                      adjustmentAmount: Pick<
                                        StorefrontAPI.MoneyV2,
                                        'amount' | 'currencyCode'
                                      >;
                                    }
                                  | {
                                      price: Pick<
                                        StorefrontAPI.MoneyV2,
                                        'amount' | 'currencyCode'
                                      >;
                                    }
                                  | Pick<
                                      StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                                      'adjustmentPercentage'
                                    >;
                              }
                            >;
                          };
                          priceAdjustments: Array<{
                            compareAtPrice: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                            price: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                            perDeliveryPrice: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                            unitPrice?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >
                            >;
                          }>;
                        };
                      }>;
                    };
                  };
                }
              >;
            });
      }>;
    };
  };

export type CartAttributesQueryVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID']['input'];
}>;

export type CartAttributesQuery = {
  cart?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Cart, 'id'> & {
      attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
    }
  >;
};

export type CollectionFragmentFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'description' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
  >;
  products: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
    >;
    filters: Array<
      Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
        values: Array<
          Pick<
            StorefrontAPI.FilterValue,
            'id' | 'label' | 'count' | 'input'
          > & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Swatch, 'color'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.MediaImage,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  }
                >;
              }
            >;
          }
        >;
      }
    >;
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'handle'
        | 'vendor'
        | 'description'
        | 'productType'
        | 'createdAt'
        | 'publishedAt'
        | 'tags'
      > & {
        collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
        priceRange: {
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        media: {
          nodes: Array<
            | (Pick<
                StorefrontAPI.ExternalVideo,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.MediaImage,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.Model3d,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'height' | 'url' | 'width' | 'mimeType'
                  >
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
          >;
        };
        options: Array<
          Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
            optionValues: Array<
              Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
                swatch?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                    image?: StorefrontAPI.Maybe<
                      | (Pick<
                          StorefrontAPI.ExternalVideo,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.MediaImage,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Model3d,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Video,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                    >;
                  }
                >;
              }
            >;
          }
        >;
        sellingPlanGroups: {
          nodes: Array<
            Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
              >;
              sellingPlans: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  }
                >;
              };
            }
          >;
        };
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              | 'id'
              | 'title'
              | 'availableForSale'
              | 'sku'
              | 'weight'
              | 'weightUnit'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
              sellingPlanAllocations: {
                nodes: Array<{
                  sellingPlan: Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  };
                  priceAdjustments: Array<{
                    compareAtPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    perDeliveryPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                  }>;
                }>;
              };
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<
                StorefrontAPI.Product,
                'handle' | 'id' | 'productType' | 'title' | 'tags'
              >;
            }
          >;
        };
      }
    >;
  };
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductCollectionSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'title' | 'description' | 'handle'
    > & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
      >;
      products: {
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              > & {
                swatch?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Swatch, 'color'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.MediaImage,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      }
                    >;
                  }
                >;
              }
            >;
          }
        >;
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'handle'
            | 'vendor'
            | 'description'
            | 'productType'
            | 'createdAt'
            | 'publishedAt'
            | 'tags'
          > & {
            collections: {
              nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'altText' | 'height' | 'id' | 'url' | 'width'
              >
            >;
            priceRange: {
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            media: {
              nodes: Array<
                | (Pick<
                    StorefrontAPI.ExternalVideo,
                    'alt' | 'id' | 'mediaContentType'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'height' | 'id' | 'url' | 'width'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.MediaImage,
                    'alt' | 'id' | 'mediaContentType'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'height' | 'id' | 'url' | 'width'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.Model3d,
                    'alt' | 'id' | 'mediaContentType'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'height' | 'id' | 'url' | 'width'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.Video,
                    'alt' | 'id' | 'mediaContentType'
                  > & {
                    sources: Array<
                      Pick<
                        StorefrontAPI.VideoSource,
                        'height' | 'url' | 'width' | 'mimeType'
                      >
                    >;
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'altText' | 'height' | 'id' | 'url' | 'width'
                      >
                    >;
                  })
              >;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
                    swatch?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                        image?: StorefrontAPI.Maybe<
                          | (Pick<
                              StorefrontAPI.ExternalVideo,
                              'mediaContentType' | 'id' | 'alt'
                            > & {
                              previewImage?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'height' | 'id' | 'url' | 'width' | 'altText'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.MediaImage,
                              'mediaContentType' | 'id' | 'alt'
                            > & {
                              previewImage?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'height' | 'id' | 'url' | 'width' | 'altText'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Model3d,
                              'mediaContentType' | 'id' | 'alt'
                            > & {
                              previewImage?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'height' | 'id' | 'url' | 'width' | 'altText'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Video,
                              'mediaContentType' | 'id' | 'alt'
                            > & {
                              previewImage?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'height' | 'id' | 'url' | 'width' | 'altText'
                                >
                              >;
                            })
                        >;
                      }
                    >;
                  }
                >;
              }
            >;
            sellingPlanGroups: {
              nodes: Array<
                Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
                  options: Array<
                    Pick<
                      StorefrontAPI.SellingPlanGroupOption,
                      'name' | 'values'
                    >
                  >;
                  sellingPlans: {
                    nodes: Array<
                      Pick<
                        StorefrontAPI.SellingPlan,
                        'id' | 'name' | 'description' | 'recurringDeliveries'
                      > & {
                        options: Array<
                          Pick<
                            StorefrontAPI.SellingPlanOption,
                            'name' | 'value'
                          >
                        >;
                        priceAdjustments: Array<
                          Pick<
                            StorefrontAPI.SellingPlanPriceAdjustment,
                            'orderCount'
                          > & {
                            adjustmentValue:
                              | {
                                  adjustmentAmount: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              | {
                                  price: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              | Pick<
                                  StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                                  'adjustmentPercentage'
                                >;
                          }
                        >;
                      }
                    >;
                  };
                }
              >;
            };
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  | 'id'
                  | 'title'
                  | 'availableForSale'
                  | 'sku'
                  | 'weight'
                  | 'weightUnit'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'altText' | 'height' | 'id' | 'url' | 'width'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                  sellingPlanAllocations: {
                    nodes: Array<{
                      sellingPlan: Pick<
                        StorefrontAPI.SellingPlan,
                        'id' | 'name' | 'description' | 'recurringDeliveries'
                      > & {
                        options: Array<
                          Pick<
                            StorefrontAPI.SellingPlanOption,
                            'name' | 'value'
                          >
                        >;
                        priceAdjustments: Array<
                          Pick<
                            StorefrontAPI.SellingPlanPriceAdjustment,
                            'orderCount'
                          > & {
                            adjustmentValue:
                              | {
                                  adjustmentAmount: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              | {
                                  price: Pick<
                                    StorefrontAPI.MoneyV2,
                                    'amount' | 'currencyCode'
                                  >;
                                }
                              | Pick<
                                  StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                                  'adjustmentPercentage'
                                >;
                          }
                        >;
                      };
                      priceAdjustments: Array<{
                        compareAtPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        perDeliveryPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                        unitPrice?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                        >;
                      }>;
                    }>;
                  };
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<
                    StorefrontAPI.Product,
                    'handle' | 'id' | 'productType' | 'title' | 'tags'
                  >;
                }
              >;
            };
          }
        >;
      };
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type CollectionFiltersQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CollectionFiltersQuery = {
  collection?: StorefrontAPI.Maybe<{
    products: {
      filters: Array<
        Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
          values: Array<
            Pick<StorefrontAPI.FilterValue, 'id' | 'label' | 'count' | 'input'>
          >;
        }
      >;
    };
  }>;
};

export type OptionFragmentFragment = Pick<
  StorefrontAPI.ProductOption,
  'id' | 'name'
> & {
  optionValues: Array<
    Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
      swatch?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
          image?: StorefrontAPI.Maybe<
            | (Pick<
                StorefrontAPI.ExternalVideo,
                'mediaContentType' | 'id' | 'alt'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'height' | 'id' | 'url' | 'width' | 'altText'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.MediaImage,
                'mediaContentType' | 'id' | 'alt'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'height' | 'id' | 'url' | 'width' | 'altText'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.Model3d,
                'mediaContentType' | 'id' | 'alt'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'height' | 'id' | 'url' | 'width' | 'altText'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Video, 'mediaContentType' | 'id' | 'alt'> & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'height' | 'id' | 'url' | 'width' | 'altText'
                  >
                >;
              })
          >;
        }
      >;
    }
  >;
};

export type VariantFragmentFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'title' | 'availableForSale' | 'sku' | 'weight' | 'weightUnit'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
  sellingPlanAllocations: {
    nodes: Array<{
      sellingPlan: Pick<
        StorefrontAPI.SellingPlan,
        'id' | 'name' | 'description' | 'recurringDeliveries'
      > & {
        options: Array<Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>>;
        priceAdjustments: Array<
          Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
            adjustmentValue:
              | {
                  adjustmentAmount: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                }
              | {price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
              | Pick<
                  StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                  'adjustmentPercentage'
                >;
          }
        >;
      };
      priceAdjustments: Array<{
        compareAtPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        perDeliveryPrice: Pick<
          StorefrontAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }>;
    }>;
  };
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
  >;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  product: Pick<
    StorefrontAPI.Product,
    'handle' | 'id' | 'productType' | 'title' | 'tags'
  >;
};

export type ProductFragmentFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'handle'
  | 'vendor'
  | 'description'
  | 'descriptionHtml'
  | 'productType'
  | 'publishedAt'
  | 'tags'
> & {
  collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
  >;
  priceRange: {
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  media: {
    nodes: Array<
      | (Pick<
          StorefrontAPI.ExternalVideo,
          'originUrl' | 'alt' | 'embedUrl' | 'host' | 'id' | 'mediaContentType'
        > & {
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
        })
      | (Pick<StorefrontAPI.MediaImage, 'alt' | 'id' | 'mediaContentType'> & {
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
        })
      | (Pick<StorefrontAPI.Model3d, 'id' | 'alt' | 'mediaContentType'> & {
          sources: Array<
            Pick<
              StorefrontAPI.Model3dSource,
              'filesize' | 'format' | 'mimeType' | 'url'
            >
          >;
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
        })
      | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
          sources: Array<
            Pick<
              StorefrontAPI.VideoSource,
              'height' | 'url' | 'width' | 'mimeType'
            >
          >;
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
        })
    >;
  };
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
      optionValues: Array<
        Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
          swatch?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
              image?: StorefrontAPI.Maybe<
                | (Pick<
                    StorefrontAPI.ExternalVideo,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.MediaImage,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.Model3d,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.Video,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  })
              >;
            }
          >;
        }
      >;
    }
  >;
  selectedVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'id' | 'title' | 'availableForSale' | 'sku' | 'weight' | 'weightUnit'
    > & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
      sellingPlanAllocations: {
        nodes: Array<{
          sellingPlan: Pick<
            StorefrontAPI.SellingPlan,
            'id' | 'name' | 'description' | 'recurringDeliveries'
          > & {
            options: Array<
              Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
            >;
            priceAdjustments: Array<
              Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
                adjustmentValue:
                  | {
                      adjustmentAmount: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    }
                  | {
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    }
                  | Pick<
                      StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                      'adjustmentPercentage'
                    >;
              }
            >;
          };
          priceAdjustments: Array<{
            compareAtPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            perDeliveryPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }>;
        }>;
      };
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
      >;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      product: Pick<
        StorefrontAPI.Product,
        'handle' | 'id' | 'productType' | 'title' | 'tags'
      >;
    }
  >;
  sellingPlanGroups: {
    nodes: Array<
      Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
        options: Array<
          Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
        >;
        sellingPlans: {
          nodes: Array<
            Pick<
              StorefrontAPI.SellingPlan,
              'id' | 'name' | 'description' | 'recurringDeliveries'
            > & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
              >;
              priceAdjustments: Array<
                Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
                  adjustmentValue:
                    | {
                        adjustmentAmount: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    | {
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    | Pick<
                        StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                        'adjustmentPercentage'
                      >;
                }
              >;
            }
          >;
        };
      }
    >;
  };
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'title' | 'availableForSale' | 'sku' | 'weight' | 'weightUnit'
      > & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        sellingPlanAllocations: {
          nodes: Array<{
            sellingPlan: Pick<
              StorefrontAPI.SellingPlan,
              'id' | 'name' | 'description' | 'recurringDeliveries'
            > & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
              >;
              priceAdjustments: Array<
                Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
                  adjustmentValue:
                    | {
                        adjustmentAmount: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    | {
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    | Pick<
                        StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                        'adjustmentPercentage'
                      >;
                }
              >;
            };
            priceAdjustments: Array<{
              compareAtPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              perDeliveryPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }>;
          }>;
        };
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        product: Pick<
          StorefrontAPI.Product,
          'handle' | 'id' | 'productType' | 'title' | 'tags'
        >;
      }
    >;
  };
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type ProductItemFragmentFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'handle'
  | 'vendor'
  | 'description'
  | 'productType'
  | 'createdAt'
  | 'publishedAt'
  | 'tags'
> & {
  collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
  >;
  priceRange: {
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  media: {
    nodes: Array<
      | (Pick<
          StorefrontAPI.ExternalVideo,
          'alt' | 'id' | 'mediaContentType'
        > & {
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
        })
      | (Pick<StorefrontAPI.MediaImage, 'alt' | 'id' | 'mediaContentType'> & {
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
        })
      | (Pick<StorefrontAPI.Model3d, 'alt' | 'id' | 'mediaContentType'> & {
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
        })
      | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
          sources: Array<
            Pick<
              StorefrontAPI.VideoSource,
              'height' | 'url' | 'width' | 'mimeType'
            >
          >;
          previewImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
        })
    >;
  };
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
      optionValues: Array<
        Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
          swatch?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
              image?: StorefrontAPI.Maybe<
                | (Pick<
                    StorefrontAPI.ExternalVideo,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.MediaImage,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.Model3d,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  })
                | (Pick<
                    StorefrontAPI.Video,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  })
              >;
            }
          >;
        }
      >;
    }
  >;
  sellingPlanGroups: {
    nodes: Array<
      Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
        options: Array<
          Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
        >;
        sellingPlans: {
          nodes: Array<
            Pick<
              StorefrontAPI.SellingPlan,
              'id' | 'name' | 'description' | 'recurringDeliveries'
            > & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
              >;
              priceAdjustments: Array<
                Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
                  adjustmentValue:
                    | {
                        adjustmentAmount: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    | {
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    | Pick<
                        StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                        'adjustmentPercentage'
                      >;
                }
              >;
            }
          >;
        };
      }
    >;
  };
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'title' | 'availableForSale' | 'sku' | 'weight' | 'weightUnit'
      > & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        sellingPlanAllocations: {
          nodes: Array<{
            sellingPlan: Pick<
              StorefrontAPI.SellingPlan,
              'id' | 'name' | 'description' | 'recurringDeliveries'
            > & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
              >;
              priceAdjustments: Array<
                Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
                  adjustmentValue:
                    | {
                        adjustmentAmount: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    | {
                        price: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      }
                    | Pick<
                        StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                        'adjustmentPercentage'
                      >;
                }
              >;
            };
            priceAdjustments: Array<{
              compareAtPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              perDeliveryPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }>;
          }>;
        };
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        product: Pick<
          StorefrontAPI.Product,
          'handle' | 'id' | 'productType' | 'title' | 'tags'
        >;
      }
    >;
  };
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'handle'
      | 'vendor'
      | 'description'
      | 'descriptionHtml'
      | 'productType'
      | 'publishedAt'
      | 'tags'
    > & {
      collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
      >;
      priceRange: {
        maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      media: {
        nodes: Array<
          | (Pick<
              StorefrontAPI.ExternalVideo,
              | 'originUrl'
              | 'alt'
              | 'embedUrl'
              | 'host'
              | 'id'
              | 'mediaContentType'
            > & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<
              StorefrontAPI.MediaImage,
              'alt' | 'id' | 'mediaContentType'
            > & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<StorefrontAPI.Model3d, 'id' | 'alt' | 'mediaContentType'> & {
              sources: Array<
                Pick<
                  StorefrontAPI.Model3dSource,
                  'filesize' | 'format' | 'mimeType' | 'url'
                >
              >;
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
              sources: Array<
                Pick<
                  StorefrontAPI.VideoSource,
                  'height' | 'url' | 'width' | 'mimeType'
                >
              >;
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
        >;
      };
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<
                    | (Pick<
                        StorefrontAPI.ExternalVideo,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Model3d,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Video,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                  >;
                }
              >;
            }
          >;
        }
      >;
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'title' | 'availableForSale' | 'sku' | 'weight' | 'weightUnit'
        > & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'altText' | 'height' | 'id' | 'url' | 'width'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          sellingPlanAllocations: {
            nodes: Array<{
              sellingPlan: Pick<
                StorefrontAPI.SellingPlan,
                'id' | 'name' | 'description' | 'recurringDeliveries'
              > & {
                options: Array<
                  Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                >;
                priceAdjustments: Array<
                  Pick<
                    StorefrontAPI.SellingPlanPriceAdjustment,
                    'orderCount'
                  > & {
                    adjustmentValue:
                      | {
                          adjustmentAmount: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                        }
                      | {
                          price: Pick<
                            StorefrontAPI.MoneyV2,
                            'amount' | 'currencyCode'
                          >;
                        }
                      | Pick<
                          StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                          'adjustmentPercentage'
                        >;
                  }
                >;
              };
              priceAdjustments: Array<{
                compareAtPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                perDeliveryPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                unitPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
              }>;
            }>;
          };
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          product: Pick<
            StorefrontAPI.Product,
            'handle' | 'id' | 'productType' | 'title' | 'tags'
          >;
        }
      >;
      sellingPlanGroups: {
        nodes: Array<
          Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
            options: Array<
              Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
            >;
            sellingPlans: {
              nodes: Array<
                Pick<
                  StorefrontAPI.SellingPlan,
                  'id' | 'name' | 'description' | 'recurringDeliveries'
                > & {
                  options: Array<
                    Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                  >;
                  priceAdjustments: Array<
                    Pick<
                      StorefrontAPI.SellingPlanPriceAdjustment,
                      'orderCount'
                    > & {
                      adjustmentValue:
                        | {
                            adjustmentAmount: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | {
                            price: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | Pick<
                            StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                            'adjustmentPercentage'
                          >;
                    }
                  >;
                }
              >;
            };
          }
        >;
      };
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            | 'id'
            | 'title'
            | 'availableForSale'
            | 'sku'
            | 'weight'
            | 'weightUnit'
          > & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'altText' | 'height' | 'id' | 'url' | 'width'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            sellingPlanAllocations: {
              nodes: Array<{
                sellingPlan: Pick<
                  StorefrontAPI.SellingPlan,
                  'id' | 'name' | 'description' | 'recurringDeliveries'
                > & {
                  options: Array<
                    Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                  >;
                  priceAdjustments: Array<
                    Pick<
                      StorefrontAPI.SellingPlanPriceAdjustment,
                      'orderCount'
                    > & {
                      adjustmentValue:
                        | {
                            adjustmentAmount: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | {
                            price: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | Pick<
                            StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                            'adjustmentPercentage'
                          >;
                    }
                  >;
                };
                priceAdjustments: Array<{
                  compareAtPrice: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  perDeliveryPrice: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                  unitPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                }>;
              }>;
            };
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'id' | 'productType' | 'title' | 'tags'
            >;
          }
        >;
      };
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type ProductItemQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductItemQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'handle'
      | 'vendor'
      | 'description'
      | 'productType'
      | 'createdAt'
      | 'publishedAt'
      | 'tags'
    > & {
      collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
      >;
      priceRange: {
        maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      media: {
        nodes: Array<
          | (Pick<
              StorefrontAPI.ExternalVideo,
              'alt' | 'id' | 'mediaContentType'
            > & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<
              StorefrontAPI.MediaImage,
              'alt' | 'id' | 'mediaContentType'
            > & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<StorefrontAPI.Model3d, 'alt' | 'id' | 'mediaContentType'> & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
              sources: Array<
                Pick<
                  StorefrontAPI.VideoSource,
                  'height' | 'url' | 'width' | 'mimeType'
                >
              >;
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
        >;
      };
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<
                    | (Pick<
                        StorefrontAPI.ExternalVideo,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Model3d,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Video,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                  >;
                }
              >;
            }
          >;
        }
      >;
      sellingPlanGroups: {
        nodes: Array<
          Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
            options: Array<
              Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
            >;
            sellingPlans: {
              nodes: Array<
                Pick<
                  StorefrontAPI.SellingPlan,
                  'id' | 'name' | 'description' | 'recurringDeliveries'
                > & {
                  options: Array<
                    Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                  >;
                  priceAdjustments: Array<
                    Pick<
                      StorefrontAPI.SellingPlanPriceAdjustment,
                      'orderCount'
                    > & {
                      adjustmentValue:
                        | {
                            adjustmentAmount: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | {
                            price: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | Pick<
                            StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                            'adjustmentPercentage'
                          >;
                    }
                  >;
                }
              >;
            };
          }
        >;
      };
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            | 'id'
            | 'title'
            | 'availableForSale'
            | 'sku'
            | 'weight'
            | 'weightUnit'
          > & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'altText' | 'height' | 'id' | 'url' | 'width'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            sellingPlanAllocations: {
              nodes: Array<{
                sellingPlan: Pick<
                  StorefrontAPI.SellingPlan,
                  'id' | 'name' | 'description' | 'recurringDeliveries'
                > & {
                  options: Array<
                    Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                  >;
                  priceAdjustments: Array<
                    Pick<
                      StorefrontAPI.SellingPlanPriceAdjustment,
                      'orderCount'
                    > & {
                      adjustmentValue:
                        | {
                            adjustmentAmount: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | {
                            price: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | Pick<
                            StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                            'adjustmentPercentage'
                          >;
                    }
                  >;
                };
                priceAdjustments: Array<{
                  compareAtPrice: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  perDeliveryPrice: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                  unitPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                }>;
              }>;
            };
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'id' | 'productType' | 'title' | 'tags'
            >;
          }
        >;
      };
    }
  >;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'handle'
      | 'vendor'
      | 'description'
      | 'productType'
      | 'createdAt'
      | 'publishedAt'
      | 'tags'
    > & {
      collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>
      >;
      priceRange: {
        maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      media: {
        nodes: Array<
          | (Pick<
              StorefrontAPI.ExternalVideo,
              'alt' | 'id' | 'mediaContentType'
            > & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<
              StorefrontAPI.MediaImage,
              'alt' | 'id' | 'mediaContentType'
            > & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<StorefrontAPI.Model3d, 'alt' | 'id' | 'mediaContentType'> & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
          | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
              sources: Array<
                Pick<
                  StorefrontAPI.VideoSource,
                  'height' | 'url' | 'width' | 'mimeType'
                >
              >;
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
            })
        >;
      };
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<
                    | (Pick<
                        StorefrontAPI.ExternalVideo,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.MediaImage,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Model3d,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Video,
                        'mediaContentType' | 'id' | 'alt'
                      > & {
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'height' | 'id' | 'url' | 'width' | 'altText'
                          >
                        >;
                      })
                  >;
                }
              >;
            }
          >;
        }
      >;
      sellingPlanGroups: {
        nodes: Array<
          Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
            options: Array<
              Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
            >;
            sellingPlans: {
              nodes: Array<
                Pick<
                  StorefrontAPI.SellingPlan,
                  'id' | 'name' | 'description' | 'recurringDeliveries'
                > & {
                  options: Array<
                    Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                  >;
                  priceAdjustments: Array<
                    Pick<
                      StorefrontAPI.SellingPlanPriceAdjustment,
                      'orderCount'
                    > & {
                      adjustmentValue:
                        | {
                            adjustmentAmount: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | {
                            price: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | Pick<
                            StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                            'adjustmentPercentage'
                          >;
                    }
                  >;
                }
              >;
            };
          }
        >;
      };
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            | 'id'
            | 'title'
            | 'availableForSale'
            | 'sku'
            | 'weight'
            | 'weightUnit'
          > & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'altText' | 'height' | 'id' | 'url' | 'width'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            sellingPlanAllocations: {
              nodes: Array<{
                sellingPlan: Pick<
                  StorefrontAPI.SellingPlan,
                  'id' | 'name' | 'description' | 'recurringDeliveries'
                > & {
                  options: Array<
                    Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                  >;
                  priceAdjustments: Array<
                    Pick<
                      StorefrontAPI.SellingPlanPriceAdjustment,
                      'orderCount'
                    > & {
                      adjustmentValue:
                        | {
                            adjustmentAmount: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | {
                            price: Pick<
                              StorefrontAPI.MoneyV2,
                              'amount' | 'currencyCode'
                            >;
                          }
                        | Pick<
                            StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                            'adjustmentPercentage'
                          >;
                    }
                  >;
                };
                priceAdjustments: Array<{
                  compareAtPrice: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  perDeliveryPrice: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                  unitPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                }>;
              }>;
            };
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'id' | 'productType' | 'title' | 'tags'
            >;
          }
        >;
      };
    }
  >;
};

export type ProductOptionsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductOptionsQuery = {
  product?: StorefrontAPI.Maybe<{
    options: Array<
      Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
        optionValues: Array<
          Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                image?: StorefrontAPI.Maybe<
                  | (Pick<
                      StorefrontAPI.ExternalVideo,
                      'mediaContentType' | 'id' | 'alt'
                    > & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'height' | 'id' | 'url' | 'width' | 'altText'
                        >
                      >;
                    })
                  | (Pick<
                      StorefrontAPI.MediaImage,
                      'mediaContentType' | 'id' | 'alt'
                    > & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'height' | 'id' | 'url' | 'width' | 'altText'
                        >
                      >;
                    })
                  | (Pick<
                      StorefrontAPI.Model3d,
                      'mediaContentType' | 'id' | 'alt'
                    > & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'height' | 'id' | 'url' | 'width' | 'altText'
                        >
                      >;
                    })
                  | (Pick<
                      StorefrontAPI.Video,
                      'mediaContentType' | 'id' | 'alt'
                    > & {
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'height' | 'id' | 'url' | 'width' | 'altText'
                        >
                      >;
                    })
                >;
              }
            >;
          }
        >;
      }
    >;
  }>;
};

export type ProductsQueryVariables = StorefrontAPI.Exact<{
  query?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductSortKeys>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type ProductsQuery = {
  products: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'startCursor' | 'endCursor' | 'hasNextPage' | 'hasPreviousPage'
    >;
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'handle'
        | 'vendor'
        | 'description'
        | 'productType'
        | 'createdAt'
        | 'publishedAt'
        | 'tags'
      > & {
        collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
        priceRange: {
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        media: {
          nodes: Array<
            | (Pick<
                StorefrontAPI.ExternalVideo,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.MediaImage,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.Model3d,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'height' | 'url' | 'width' | 'mimeType'
                  >
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
          >;
        };
        options: Array<
          Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
            optionValues: Array<
              Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
                swatch?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                    image?: StorefrontAPI.Maybe<
                      | (Pick<
                          StorefrontAPI.ExternalVideo,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.MediaImage,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Model3d,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Video,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                    >;
                  }
                >;
              }
            >;
          }
        >;
        sellingPlanGroups: {
          nodes: Array<
            Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
              >;
              sellingPlans: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  }
                >;
              };
            }
          >;
        };
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              | 'id'
              | 'title'
              | 'availableForSale'
              | 'sku'
              | 'weight'
              | 'weightUnit'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
              sellingPlanAllocations: {
                nodes: Array<{
                  sellingPlan: Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  };
                  priceAdjustments: Array<{
                    compareAtPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    perDeliveryPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                  }>;
                }>;
              };
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<
                StorefrontAPI.Product,
                'handle' | 'id' | 'productType' | 'title' | 'tags'
              >;
            }
          >;
        };
      }
    >;
  };
};

export type ProductsFeedQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
  cursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductsFeedQuery = {
  products: {
    pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage' | 'endCursor'>;
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'handle'
        | 'vendor'
        | 'description'
        | 'productType'
        | 'createdAt'
        | 'publishedAt'
        | 'tags'
      > & {
        collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
        priceRange: {
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        media: {
          nodes: Array<
            | (Pick<
                StorefrontAPI.ExternalVideo,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.MediaImage,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.Model3d,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'height' | 'url' | 'width' | 'mimeType'
                  >
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
          >;
        };
        options: Array<
          Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
            optionValues: Array<
              Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
                swatch?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                    image?: StorefrontAPI.Maybe<
                      | (Pick<
                          StorefrontAPI.ExternalVideo,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.MediaImage,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Model3d,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Video,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                    >;
                  }
                >;
              }
            >;
          }
        >;
        sellingPlanGroups: {
          nodes: Array<
            Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
              >;
              sellingPlans: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  }
                >;
              };
            }
          >;
        };
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              | 'id'
              | 'title'
              | 'availableForSale'
              | 'sku'
              | 'weight'
              | 'weightUnit'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
              sellingPlanAllocations: {
                nodes: Array<{
                  sellingPlan: Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  };
                  priceAdjustments: Array<{
                    compareAtPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    perDeliveryPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                  }>;
                }>;
              };
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<
                StorefrontAPI.Product,
                'handle' | 'id' | 'productType' | 'title' | 'tags'
              >;
            }
          >;
        };
      }
    >;
  };
};

export type ProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  productId: StorefrontAPI.Scalars['ID']['input'];
  intent?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductRecommendationIntent>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductRecommendationsQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'handle'
        | 'vendor'
        | 'description'
        | 'productType'
        | 'createdAt'
        | 'publishedAt'
        | 'tags'
      > & {
        collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
        priceRange: {
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        media: {
          nodes: Array<
            | (Pick<
                StorefrontAPI.ExternalVideo,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.MediaImage,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.Model3d,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'height' | 'url' | 'width' | 'mimeType'
                  >
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
          >;
        };
        options: Array<
          Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
            optionValues: Array<
              Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
                swatch?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                    image?: StorefrontAPI.Maybe<
                      | (Pick<
                          StorefrontAPI.ExternalVideo,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.MediaImage,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Model3d,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Video,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                    >;
                  }
                >;
              }
            >;
          }
        >;
        sellingPlanGroups: {
          nodes: Array<
            Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
              >;
              sellingPlans: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  }
                >;
              };
            }
          >;
        };
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              | 'id'
              | 'title'
              | 'availableForSale'
              | 'sku'
              | 'weight'
              | 'weightUnit'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
              sellingPlanAllocations: {
                nodes: Array<{
                  sellingPlan: Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  };
                  priceAdjustments: Array<{
                    compareAtPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    perDeliveryPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                  }>;
                }>;
              };
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<
                StorefrontAPI.Product,
                'handle' | 'id' | 'productType' | 'title' | 'tags'
              >;
            }
          >;
        };
      }
    >
  >;
};

export type ProductsSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  searchTerm: StorefrontAPI.Scalars['String']['input'];
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.SearchSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
}>;

export type ProductsSearchQuery = {
  search: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'handle'
        | 'vendor'
        | 'description'
        | 'productType'
        | 'createdAt'
        | 'publishedAt'
        | 'tags'
      > & {
        collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'altText' | 'height' | 'id' | 'url' | 'width'
          >
        >;
        priceRange: {
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        media: {
          nodes: Array<
            | (Pick<
                StorefrontAPI.ExternalVideo,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.MediaImage,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<
                StorefrontAPI.Model3d,
                'alt' | 'id' | 'mediaContentType'
              > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Video, 'alt' | 'id' | 'mediaContentType'> & {
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'height' | 'url' | 'width' | 'mimeType'
                  >
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'id' | 'url' | 'width'
                  >
                >;
              })
          >;
        };
        options: Array<
          Pick<StorefrontAPI.ProductOption, 'id' | 'name'> & {
            optionValues: Array<
              Pick<StorefrontAPI.ProductOptionValue, 'id' | 'name'> & {
                swatch?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                    image?: StorefrontAPI.Maybe<
                      | (Pick<
                          StorefrontAPI.ExternalVideo,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.MediaImage,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Model3d,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Video,
                          'mediaContentType' | 'id' | 'alt'
                        > & {
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'height' | 'id' | 'url' | 'width' | 'altText'
                            >
                          >;
                        })
                    >;
                  }
                >;
              }
            >;
          }
        >;
        sellingPlanGroups: {
          nodes: Array<
            Pick<StorefrontAPI.SellingPlanGroup, 'name' | 'appName'> & {
              options: Array<
                Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>
              >;
              sellingPlans: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  }
                >;
              };
            }
          >;
        };
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              | 'id'
              | 'title'
              | 'availableForSale'
              | 'sku'
              | 'weight'
              | 'weightUnit'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'altText' | 'height' | 'id' | 'url' | 'width'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
              sellingPlanAllocations: {
                nodes: Array<{
                  sellingPlan: Pick<
                    StorefrontAPI.SellingPlan,
                    'id' | 'name' | 'description' | 'recurringDeliveries'
                  > & {
                    options: Array<
                      Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>
                    >;
                    priceAdjustments: Array<
                      Pick<
                        StorefrontAPI.SellingPlanPriceAdjustment,
                        'orderCount'
                      > & {
                        adjustmentValue:
                          | {
                              adjustmentAmount: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | {
                              price: Pick<
                                StorefrontAPI.MoneyV2,
                                'amount' | 'currencyCode'
                              >;
                            }
                          | Pick<
                              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                              'adjustmentPercentage'
                            >;
                      }
                    >;
                  };
                  priceAdjustments: Array<{
                    compareAtPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    price: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    perDeliveryPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                    unitPrice?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                    >;
                  }>;
                }>;
              };
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<
                StorefrontAPI.Product,
                'handle' | 'id' | 'productType' | 'title' | 'tags'
              >;
            }
          >;
        };
      }
    >;
    filters: Array<
      Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
        values: Array<
          Pick<
            StorefrontAPI.FilterValue,
            'id' | 'label' | 'count' | 'input'
          > & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Swatch, 'color'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.MediaImage,
                    'mediaContentType' | 'id' | 'alt'
                  > & {
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'height' | 'id' | 'url' | 'width' | 'altText'
                      >
                    >;
                  }
                >;
              }
            >;
          }
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'startCursor' | 'endCursor' | 'hasNextPage' | 'hasPreviousPage'
    >;
  };
};

export type PredictiveCollectionFragmentFragment = {
  __typename: 'Collection';
} & Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveQueryFragmentFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<StorefrontAPI.SearchQuerySuggestion, 'text' | 'styledText'>;

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int']['input'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  searchTerm: StorefrontAPI.Scalars['String']['input'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText'
      >
    >;
  }>;
};

export type SellingPlanAllocationFragmentFragment = {
  sellingPlan: Pick<
    StorefrontAPI.SellingPlan,
    'id' | 'name' | 'description' | 'recurringDeliveries'
  > & {
    options: Array<Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>>;
    priceAdjustments: Array<
      Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
        adjustmentValue:
          | {
              adjustmentAmount: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            }
          | {price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
          | Pick<
              StorefrontAPI.SellingPlanPercentagePriceAdjustment,
              'adjustmentPercentage'
            >;
      }
    >;
  };
  priceAdjustments: Array<{
    compareAtPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    perDeliveryPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    unitPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
    >;
  }>;
};

export type SellingPlanGroupFragmentFragment = Pick<
  StorefrontAPI.SellingPlanGroup,
  'name' | 'appName'
> & {
  options: Array<Pick<StorefrontAPI.SellingPlanGroupOption, 'name' | 'values'>>;
  sellingPlans: {
    nodes: Array<
      Pick<
        StorefrontAPI.SellingPlan,
        'id' | 'name' | 'description' | 'recurringDeliveries'
      > & {
        options: Array<Pick<StorefrontAPI.SellingPlanOption, 'name' | 'value'>>;
        priceAdjustments: Array<
          Pick<StorefrontAPI.SellingPlanPriceAdjustment, 'orderCount'> & {
            adjustmentValue:
              | {
                  adjustmentAmount: Pick<
                    StorefrontAPI.MoneyV2,
                    'amount' | 'currencyCode'
                  >;
                }
              | {price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
              | Pick<
                  StorefrontAPI.SellingPlanPercentagePriceAdjustment,
                  'adjustmentPercentage'
                >;
          }
        >;
      }
    >;
  };
};

export type LayoutQueryVariables = StorefrontAPI.Exact<{[key: string]: never}>;

export type LayoutQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
};

export type CountryFragmentFragment = Pick<
  StorefrontAPI.Country,
  'isoCode' | 'name' | 'unitSystem'
> & {currency: Pick<StorefrontAPI.Currency, 'isoCode' | 'name' | 'symbol'>};

export type PolicyFragmentFragment = {__typename: 'ShopPolicy'} & Pick<
  StorefrontAPI.ShopPolicy,
  'handle' | 'id' | 'title' | 'body'
>;

export type ShopQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ShopQuery = {
  shop: Pick<
    StorefrontAPI.Shop,
    'description' | 'moneyFormat' | 'name' | 'shipsToCountries'
  > & {
    paymentSettings: Pick<
      StorefrontAPI.PaymentSettings,
      | 'acceptedCardBrands'
      | 'cardVaultUrl'
      | 'countryCode'
      | 'currencyCode'
      | 'enabledPresentmentCurrencies'
      | 'supportedDigitalWallets'
      | 'shopifyPaymentsAccountId'
    >;
    primaryDomain: Pick<StorefrontAPI.Domain, 'host' | 'sslEnabled' | 'url'>;
    privacyPolicy?: StorefrontAPI.Maybe<
      {__typename: 'ShopPolicy'} & Pick<
        StorefrontAPI.ShopPolicy,
        'handle' | 'id' | 'title' | 'body'
      >
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      {__typename: 'ShopPolicy'} & Pick<
        StorefrontAPI.ShopPolicy,
        'handle' | 'id' | 'title' | 'body'
      >
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      {__typename: 'ShopPolicy'} & Pick<
        StorefrontAPI.ShopPolicy,
        'handle' | 'id' | 'title' | 'body'
      >
    >;
    termsOfService?: StorefrontAPI.Maybe<
      {__typename: 'ShopPolicy'} & Pick<
        StorefrontAPI.ShopPolicy,
        'handle' | 'id' | 'title' | 'body'
      >
    >;
  };
};

export type LocalizationQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type LocalizationQuery = {
  shop: {
    paymentSettings: {
      enabledCurrencies: StorefrontAPI.PaymentSettings['enabledPresentmentCurrencies'];
    };
  };
  localization: {
    availableCountries: Array<
      Pick<StorefrontAPI.Country, 'isoCode' | 'name' | 'unitSystem'> & {
        currency: Pick<StorefrontAPI.Currency, 'isoCode' | 'name' | 'symbol'>;
      }
    >;
    country: Pick<StorefrontAPI.Country, 'isoCode' | 'name' | 'unitSystem'> & {
      currency: Pick<StorefrontAPI.Currency, 'isoCode' | 'name' | 'symbol'>;
    };
  };
};

export type ProductsSearchFiltersQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  searchTerm: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductsSearchFiltersQuery = {
  search: {
    filters: Array<
      Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
        values: Array<
          Pick<StorefrontAPI.FilterValue, 'id' | 'label' | 'count' | 'input'>
        >;
      }
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  query CartAttributes($id: ID!) {\n    cart: cart(id: $id) {\n      id\n      attributes {\n        key\n        value\n      }\n    }\n  }\n': {
    return: CartAttributesQuery;
    variables: CartAttributesQueryVariables;
  };
  '#graphql\n  query Collection(\n    $handle: String!,\n    $country: CountryCode,\n    $language: LanguageCode\n    $sortKey: ProductCollectionSortKeys\n    $reverse: Boolean\n    $filters: [ProductFilter!]\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      ... on Collection {\n        ...CollectionFragment\n      }\n    }\n  }\n  #graphql\n  fragment CollectionFragment on Collection {\n    id\n    title\n    description\n    handle\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    products(\n      sortKey: $sortKey,\n      reverse: $reverse,\n      filters: $filters,\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        endCursor\n        startCursor\n      }\n      filters {\n        id\n        label\n        type\n        values {\n          id\n          label\n          count\n          input\n          swatch {\n            color\n            image {\n              mediaContentType\n              previewImage {\n                height\n                id\n                url\n                width\n                altText\n              }\n              id\n              alt\n            }\n          }\n        }\n      }\n      nodes {\n        ... on Product {\n          ...ProductItemFragment\n        }\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment ProductItemFragment on Product {\n    id\n    title\n    handle\n    vendor\n    description\n    productType\n    createdAt\n    publishedAt\n    tags\n    collections(first: 10) {\n      nodes {\n        handle\n      }\n    }\n    featuredImage {\n      altText\n      height\n      id\n      url\n      width\n    }\n    priceRange {\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    media(first: 10) {\n      nodes {\n        alt\n        id\n        mediaContentType\n        previewImage {\n          altText\n          height\n          id\n          url\n          width\n        }\n        ... on Video {\n          sources {\n            height\n            url\n            width\n            mimeType\n          }\n        }\n      }\n    }\n    #REQUIRED_VAR=getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)\n    options {\n      ...OptionFragment\n    }\n    sellingPlanGroups(first: 10) {\n      nodes {\n        ... on SellingPlanGroup {\n          ...SellingPlanGroupFragment\n        }\n      }\n    }\n    variants(first: 100) {\n      nodes {\n        ... on ProductVariant {\n            ...VariantFragment\n          }\n      }\n    }\n  }\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    sku\n    weight\n    weightUnit\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    price {\n      currencyCode\n      amount\n    }\n    sellingPlanAllocations(first: 10) {\n      nodes {\n        ... on SellingPlanAllocation {\n          ...SellingPlanAllocationFragment\n        }\n      }\n    }\n    compareAtPrice {\n      currencyCode\n      amount\n    }\n    selectedOptions {\n      name\n      value\n    }\n    product {\n      handle\n      id\n      productType\n      title\n      tags\n    }\n  }\n  #REQUIRED_VAR=SELLING_PLAN_ALLOCATION_FRAGMENT\n\n  #graphql\n  fragment SellingPlanGroupFragment on SellingPlanGroup {\n    name\n    appName\n    options {\n      name\n      values\n    }\n    sellingPlans(first: 10) {\n      nodes {\n        id\n        name\n        description\n        recurringDeliveries\n        options {\n          name\n          value\n        }\n        priceAdjustments {\n          orderCount\n          adjustmentValue {\n            ... on SellingPlanFixedAmountPriceAdjustment {\n              adjustmentAmount {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanFixedPriceAdjustment {\n              price {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanPercentagePriceAdjustment {\n              adjustmentPercentage\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n\n\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  query CollectionFilters(\n    $handle: String!,\n    $country: CountryCode,\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      products(first: 1) {\n        filters {\n          id\n          label\n          type\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n      }\n    }\n  }\n': {
    return: CollectionFiltersQuery;
    variables: CollectionFiltersQueryVariables;
  };
  '#graphql\n  query Product(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ... on Product {\n        ...ProductFragment\n      }\n    }\n  }\n  #graphql\n  fragment ProductFragment on Product {\n    id\n    title\n    handle\n    vendor\n    description\n    descriptionHtml\n    productType\n    publishedAt\n    tags\n    collections(first: 250) {\n      nodes {\n        handle\n      }\n    }\n    featuredImage {\n      altText\n      height\n      id\n      url\n      width\n    }\n    priceRange {\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    media(first: 250) {\n      nodes {\n        alt\n        id\n        mediaContentType\n        previewImage {\n          altText\n          height\n          id\n          url\n          width\n        }\n        ... on Video {\n          sources {\n            height\n            url\n            width\n            mimeType\n          }\n        }\n        ... on ExternalVideo {\n          originUrl\n          alt\n          embedUrl\n          host\n          id\n          mediaContentType\n          previewImage {\n            altText\n            height\n            id\n            url\n            width\n          }\n        }\n        ... on Model3d {\n          id\n          alt\n          mediaContentType\n          sources {\n            filesize\n            format\n            mimeType\n            url\n          }\n          previewImage {\n            altText\n            height\n            id\n            url\n            width\n          }\n        }\n      }\n    }\n    #REQUIRED_VAR=getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)\n    options {\n      ...OptionFragment\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {\n      ... on ProductVariant {\n          ...VariantFragment\n        }\n    }\n    sellingPlanGroups(first: 10) {\n      nodes {\n        ... on SellingPlanGroup {\n          ...SellingPlanGroupFragment\n        }\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        ... on ProductVariant {\n          ...VariantFragment\n        }\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    sku\n    weight\n    weightUnit\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    price {\n      currencyCode\n      amount\n    }\n    sellingPlanAllocations(first: 10) {\n      nodes {\n        ... on SellingPlanAllocation {\n          ...SellingPlanAllocationFragment\n        }\n      }\n    }\n    compareAtPrice {\n      currencyCode\n      amount\n    }\n    selectedOptions {\n      name\n      value\n    }\n    product {\n      handle\n      id\n      productType\n      title\n      tags\n    }\n  }\n  #REQUIRED_VAR=SELLING_PLAN_ALLOCATION_FRAGMENT\n\n  #graphql\n  fragment SellingPlanGroupFragment on SellingPlanGroup {\n    name\n    appName\n    options {\n      name\n      values\n    }\n    sellingPlans(first: 10) {\n      nodes {\n        id\n        name\n        description\n        recurringDeliveries\n        options {\n          name\n          value\n        }\n        priceAdjustments {\n          orderCount\n          adjustmentValue {\n            ... on SellingPlanFixedAmountPriceAdjustment {\n              adjustmentAmount {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanFixedPriceAdjustment {\n              price {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanPercentagePriceAdjustment {\n              adjustmentPercentage\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query ProductItem(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ... on Product {\n        ...ProductItemFragment\n      }\n    }\n  }\n  #graphql\n  fragment ProductItemFragment on Product {\n    id\n    title\n    handle\n    vendor\n    description\n    productType\n    createdAt\n    publishedAt\n    tags\n    collections(first: 10) {\n      nodes {\n        handle\n      }\n    }\n    featuredImage {\n      altText\n      height\n      id\n      url\n      width\n    }\n    priceRange {\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    media(first: 10) {\n      nodes {\n        alt\n        id\n        mediaContentType\n        previewImage {\n          altText\n          height\n          id\n          url\n          width\n        }\n        ... on Video {\n          sources {\n            height\n            url\n            width\n            mimeType\n          }\n        }\n      }\n    }\n    #REQUIRED_VAR=getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)\n    options {\n      ...OptionFragment\n    }\n    sellingPlanGroups(first: 10) {\n      nodes {\n        ... on SellingPlanGroup {\n          ...SellingPlanGroupFragment\n        }\n      }\n    }\n    variants(first: 100) {\n      nodes {\n        ... on ProductVariant {\n            ...VariantFragment\n          }\n      }\n    }\n  }\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    sku\n    weight\n    weightUnit\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    price {\n      currencyCode\n      amount\n    }\n    sellingPlanAllocations(first: 10) {\n      nodes {\n        ... on SellingPlanAllocation {\n          ...SellingPlanAllocationFragment\n        }\n      }\n    }\n    compareAtPrice {\n      currencyCode\n      amount\n    }\n    selectedOptions {\n      name\n      value\n    }\n    product {\n      handle\n      id\n      productType\n      title\n      tags\n    }\n  }\n  #REQUIRED_VAR=SELLING_PLAN_ALLOCATION_FRAGMENT\n\n  #graphql\n  fragment SellingPlanGroupFragment on SellingPlanGroup {\n    name\n    appName\n    options {\n      name\n      values\n    }\n    sellingPlans(first: 10) {\n      nodes {\n        id\n        name\n        description\n        recurringDeliveries\n        options {\n          name\n          value\n        }\n        priceAdjustments {\n          orderCount\n          adjustmentValue {\n            ... on SellingPlanFixedAmountPriceAdjustment {\n              adjustmentAmount {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanFixedPriceAdjustment {\n              price {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanPercentagePriceAdjustment {\n              adjustmentPercentage\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductItemQuery;
    variables: ProductItemQueryVariables;
  };
  '#graphql\n  query product(\n    $id: ID!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(id: $id) {\n      ... on Product {\n        ...ProductItemFragment\n      }\n    }\n  }\n  #graphql\n  fragment ProductItemFragment on Product {\n    id\n    title\n    handle\n    vendor\n    description\n    productType\n    createdAt\n    publishedAt\n    tags\n    collections(first: 10) {\n      nodes {\n        handle\n      }\n    }\n    featuredImage {\n      altText\n      height\n      id\n      url\n      width\n    }\n    priceRange {\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    media(first: 10) {\n      nodes {\n        alt\n        id\n        mediaContentType\n        previewImage {\n          altText\n          height\n          id\n          url\n          width\n        }\n        ... on Video {\n          sources {\n            height\n            url\n            width\n            mimeType\n          }\n        }\n      }\n    }\n    #REQUIRED_VAR=getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)\n    options {\n      ...OptionFragment\n    }\n    sellingPlanGroups(first: 10) {\n      nodes {\n        ... on SellingPlanGroup {\n          ...SellingPlanGroupFragment\n        }\n      }\n    }\n    variants(first: 100) {\n      nodes {\n        ... on ProductVariant {\n            ...VariantFragment\n          }\n      }\n    }\n  }\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    sku\n    weight\n    weightUnit\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    price {\n      currencyCode\n      amount\n    }\n    sellingPlanAllocations(first: 10) {\n      nodes {\n        ... on SellingPlanAllocation {\n          ...SellingPlanAllocationFragment\n        }\n      }\n    }\n    compareAtPrice {\n      currencyCode\n      amount\n    }\n    selectedOptions {\n      name\n      value\n    }\n    product {\n      handle\n      id\n      productType\n      title\n      tags\n    }\n  }\n  #REQUIRED_VAR=SELLING_PLAN_ALLOCATION_FRAGMENT\n\n  #graphql\n  fragment SellingPlanGroupFragment on SellingPlanGroup {\n    name\n    appName\n    options {\n      name\n      values\n    }\n    sellingPlans(first: 10) {\n      nodes {\n        id\n        name\n        description\n        recurringDeliveries\n        options {\n          name\n          value\n        }\n        priceAdjustments {\n          orderCount\n          adjustmentValue {\n            ... on SellingPlanFixedAmountPriceAdjustment {\n              adjustmentAmount {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanFixedPriceAdjustment {\n              price {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanPercentagePriceAdjustment {\n              adjustmentPercentage\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query ProductOptions(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      options {\n        ...OptionFragment\n      }\n    }\n  }\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n': {
    return: ProductOptionsQuery;
    variables: ProductOptionsQueryVariables;
  };
  '#graphql\n  query Products(\n    $query: String\n    $first: Int\n    $reverse: Boolean\n    $country: CountryCode\n    $language: LanguageCode\n    $sortKey: ProductSortKeys\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query, after: $endCursor) {\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      nodes {\n        ... on Product {\n          ...ProductItemFragment\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductItemFragment on Product {\n    id\n    title\n    handle\n    vendor\n    description\n    productType\n    createdAt\n    publishedAt\n    tags\n    collections(first: 10) {\n      nodes {\n        handle\n      }\n    }\n    featuredImage {\n      altText\n      height\n      id\n      url\n      width\n    }\n    priceRange {\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    media(first: 10) {\n      nodes {\n        alt\n        id\n        mediaContentType\n        previewImage {\n          altText\n          height\n          id\n          url\n          width\n        }\n        ... on Video {\n          sources {\n            height\n            url\n            width\n            mimeType\n          }\n        }\n      }\n    }\n    #REQUIRED_VAR=getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)\n    options {\n      ...OptionFragment\n    }\n    sellingPlanGroups(first: 10) {\n      nodes {\n        ... on SellingPlanGroup {\n          ...SellingPlanGroupFragment\n        }\n      }\n    }\n    variants(first: 100) {\n      nodes {\n        ... on ProductVariant {\n            ...VariantFragment\n          }\n      }\n    }\n  }\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    sku\n    weight\n    weightUnit\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    price {\n      currencyCode\n      amount\n    }\n    sellingPlanAllocations(first: 10) {\n      nodes {\n        ... on SellingPlanAllocation {\n          ...SellingPlanAllocationFragment\n        }\n      }\n    }\n    compareAtPrice {\n      currencyCode\n      amount\n    }\n    selectedOptions {\n      name\n      value\n    }\n    product {\n      handle\n      id\n      productType\n      title\n      tags\n    }\n  }\n  #REQUIRED_VAR=SELLING_PLAN_ALLOCATION_FRAGMENT\n\n  #graphql\n  fragment SellingPlanGroupFragment on SellingPlanGroup {\n    name\n    appName\n    options {\n      name\n      values\n    }\n    sellingPlans(first: 10) {\n      nodes {\n        id\n        name\n        description\n        recurringDeliveries\n        options {\n          name\n          value\n        }\n        priceAdjustments {\n          orderCount\n          adjustmentValue {\n            ... on SellingPlanFixedAmountPriceAdjustment {\n              adjustmentAmount {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanFixedPriceAdjustment {\n              price {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanPercentagePriceAdjustment {\n              adjustmentPercentage\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductsQuery;
    variables: ProductsQueryVariables;
  };
  '#graphql\n  query ProductsFeed(\n    $first: Int!\n    $cursor: String\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, after: $cursor) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      nodes {\n        ... on Product {\n          ...ProductItemFragment\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductItemFragment on Product {\n    id\n    title\n    handle\n    vendor\n    description\n    productType\n    createdAt\n    publishedAt\n    tags\n    collections(first: 10) {\n      nodes {\n        handle\n      }\n    }\n    featuredImage {\n      altText\n      height\n      id\n      url\n      width\n    }\n    priceRange {\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    media(first: 10) {\n      nodes {\n        alt\n        id\n        mediaContentType\n        previewImage {\n          altText\n          height\n          id\n          url\n          width\n        }\n        ... on Video {\n          sources {\n            height\n            url\n            width\n            mimeType\n          }\n        }\n      }\n    }\n    #REQUIRED_VAR=getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)\n    options {\n      ...OptionFragment\n    }\n    sellingPlanGroups(first: 10) {\n      nodes {\n        ... on SellingPlanGroup {\n          ...SellingPlanGroupFragment\n        }\n      }\n    }\n    variants(first: 100) {\n      nodes {\n        ... on ProductVariant {\n            ...VariantFragment\n          }\n      }\n    }\n  }\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    sku\n    weight\n    weightUnit\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    price {\n      currencyCode\n      amount\n    }\n    sellingPlanAllocations(first: 10) {\n      nodes {\n        ... on SellingPlanAllocation {\n          ...SellingPlanAllocationFragment\n        }\n      }\n    }\n    compareAtPrice {\n      currencyCode\n      amount\n    }\n    selectedOptions {\n      name\n      value\n    }\n    product {\n      handle\n      id\n      productType\n      title\n      tags\n    }\n  }\n  #REQUIRED_VAR=SELLING_PLAN_ALLOCATION_FRAGMENT\n\n  #graphql\n  fragment SellingPlanGroupFragment on SellingPlanGroup {\n    name\n    appName\n    options {\n      name\n      values\n    }\n    sellingPlans(first: 10) {\n      nodes {\n        id\n        name\n        description\n        recurringDeliveries\n        options {\n          name\n          value\n        }\n        priceAdjustments {\n          orderCount\n          adjustmentValue {\n            ... on SellingPlanFixedAmountPriceAdjustment {\n              adjustmentAmount {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanFixedPriceAdjustment {\n              price {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanPercentagePriceAdjustment {\n              adjustmentPercentage\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductsFeedQuery;
    variables: ProductsFeedQueryVariables;
  };
  '#graphql\n  query ProductRecommendations(\n      $productId: ID!\n      $intent: ProductRecommendationIntent\n      $country: CountryCode\n      $language: LanguageCode\n    ) @inContext(country: $country, language: $language) {\n      productRecommendations(productId: $productId, intent: $intent) {\n        ... on Product {\n          ...ProductItemFragment\n        }\n    }\n  }\n  #graphql\n  fragment ProductItemFragment on Product {\n    id\n    title\n    handle\n    vendor\n    description\n    productType\n    createdAt\n    publishedAt\n    tags\n    collections(first: 10) {\n      nodes {\n        handle\n      }\n    }\n    featuredImage {\n      altText\n      height\n      id\n      url\n      width\n    }\n    priceRange {\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    media(first: 10) {\n      nodes {\n        alt\n        id\n        mediaContentType\n        previewImage {\n          altText\n          height\n          id\n          url\n          width\n        }\n        ... on Video {\n          sources {\n            height\n            url\n            width\n            mimeType\n          }\n        }\n      }\n    }\n    #REQUIRED_VAR=getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)\n    options {\n      ...OptionFragment\n    }\n    sellingPlanGroups(first: 10) {\n      nodes {\n        ... on SellingPlanGroup {\n          ...SellingPlanGroupFragment\n        }\n      }\n    }\n    variants(first: 100) {\n      nodes {\n        ... on ProductVariant {\n            ...VariantFragment\n          }\n      }\n    }\n  }\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    sku\n    weight\n    weightUnit\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    price {\n      currencyCode\n      amount\n    }\n    sellingPlanAllocations(first: 10) {\n      nodes {\n        ... on SellingPlanAllocation {\n          ...SellingPlanAllocationFragment\n        }\n      }\n    }\n    compareAtPrice {\n      currencyCode\n      amount\n    }\n    selectedOptions {\n      name\n      value\n    }\n    product {\n      handle\n      id\n      productType\n      title\n      tags\n    }\n  }\n  #REQUIRED_VAR=SELLING_PLAN_ALLOCATION_FRAGMENT\n\n  #graphql\n  fragment SellingPlanGroupFragment on SellingPlanGroup {\n    name\n    appName\n    options {\n      name\n      values\n    }\n    sellingPlans(first: 10) {\n      nodes {\n        id\n        name\n        description\n        recurringDeliveries\n        options {\n          name\n          value\n        }\n        priceAdjustments {\n          orderCount\n          adjustmentValue {\n            ... on SellingPlanFixedAmountPriceAdjustment {\n              adjustmentAmount {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanFixedPriceAdjustment {\n              price {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanPercentagePriceAdjustment {\n              adjustmentPercentage\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductRecommendationsQuery;
    variables: ProductRecommendationsQueryVariables;
  };
  '#graphql\n  query ProductsSearch(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $filters: [ProductFilter!]\n    $searchTerm: String!\n    $startCursor: String,\n    $sortKey: SearchSortKeys,\n    $reverse: Boolean\n  ) @inContext(country: $country, language: $language) {\n    search(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor,\n      productFilters: $filters,\n      query: $searchTerm,\n      types: PRODUCT,\n      sortKey: $sortKey,\n      reverse: $reverse,\n    ) {\n      nodes {\n        ... on Product {\n          ...ProductItemFragment\n        }\n      }\n      filters: productFilters {\n        id\n        label\n        type\n        values {\n          id\n          label\n          count\n          input\n          swatch {\n            color\n            image {\n              mediaContentType\n              previewImage {\n                height\n                id\n                url\n                width\n                altText\n              }\n              id\n              alt\n            }\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      totalCount\n    }\n  }\n\n  #graphql\n  fragment ProductItemFragment on Product {\n    id\n    title\n    handle\n    vendor\n    description\n    productType\n    createdAt\n    publishedAt\n    tags\n    collections(first: 10) {\n      nodes {\n        handle\n      }\n    }\n    featuredImage {\n      altText\n      height\n      id\n      url\n      width\n    }\n    priceRange {\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    media(first: 10) {\n      nodes {\n        alt\n        id\n        mediaContentType\n        previewImage {\n          altText\n          height\n          id\n          url\n          width\n        }\n        ... on Video {\n          sources {\n            height\n            url\n            width\n            mimeType\n          }\n        }\n      }\n    }\n    #REQUIRED_VAR=getMetafieldsQueryString(PRODUCT_METAFIELDS_IDENTIFIERS)\n    options {\n      ...OptionFragment\n    }\n    sellingPlanGroups(first: 10) {\n      nodes {\n        ... on SellingPlanGroup {\n          ...SellingPlanGroupFragment\n        }\n      }\n    }\n    variants(first: 100) {\n      nodes {\n        ... on ProductVariant {\n            ...VariantFragment\n          }\n      }\n    }\n  }\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    sku\n    weight\n    weightUnit\n    image {\n      altText\n      height\n      id\n      url\n      width\n    }\n    price {\n      currencyCode\n      amount\n    }\n    sellingPlanAllocations(first: 10) {\n      nodes {\n        ... on SellingPlanAllocation {\n          ...SellingPlanAllocationFragment\n        }\n      }\n    }\n    compareAtPrice {\n      currencyCode\n      amount\n    }\n    selectedOptions {\n      name\n      value\n    }\n    product {\n      handle\n      id\n      productType\n      title\n      tags\n    }\n  }\n  #REQUIRED_VAR=SELLING_PLAN_ALLOCATION_FRAGMENT\n\n  #graphql\n  fragment SellingPlanGroupFragment on SellingPlanGroup {\n    name\n    appName\n    options {\n      name\n      values\n    }\n    sellingPlans(first: 10) {\n      nodes {\n        id\n        name\n        description\n        recurringDeliveries\n        options {\n          name\n          value\n        }\n        priceAdjustments {\n          orderCount\n          adjustmentValue {\n            ... on SellingPlanFixedAmountPriceAdjustment {\n              adjustmentAmount {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanFixedPriceAdjustment {\n              price {\n                    amount\n            currencyCode\n              }\n            }\n            ... on SellingPlanPercentagePriceAdjustment {\n              adjustmentPercentage\n            }\n          }\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment OptionFragment on ProductOption {\n    id\n    name\n    optionValues {\n      id\n      name\n      swatch {\n        color\n        image {\n          mediaContentType\n          previewImage {\n            height\n            id\n            url\n            width\n            altText\n          }\n          id\n          alt\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductsSearchQuery;
    variables: ProductsSearchQueryVariables;
  };
  '#graphql\n  query PredictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $searchTerm: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $searchTerm,\n      types: $types,\n    ) {\n      collections {\n        ...PredictiveCollectionFragment\n      }\n      queries {\n        ...PredictiveQueryFragment\n      }\n    }\n  }\n  #graphql\n  fragment PredictiveCollectionFragment on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n  }\n\n  #graphql\n  fragment PredictiveQueryFragment on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n  }\n\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  query Layout {\n    shop {\n      id\n      name\n      description\n      brand {\n        logo {\n          image {\n            url\n          }\n        }\n      }\n    }\n  }\n': {
    return: LayoutQuery;
    variables: LayoutQueryVariables;
  };
  '#graphql\n  query Shop($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {\n    shop {\n      description\n      moneyFormat\n      name\n      paymentSettings {\n        acceptedCardBrands\n        cardVaultUrl\n        countryCode\n        currencyCode\n        enabledPresentmentCurrencies\n        supportedDigitalWallets\n        shopifyPaymentsAccountId\n      }\n      primaryDomain {\n        host\n        sslEnabled\n        url\n      }\n      privacyPolicy {\n        ...PolicyFragment\n      }\n      refundPolicy {\n        ...PolicyFragment\n      }\n      shippingPolicy {\n        ...PolicyFragment\n      }\n      shipsToCountries\n      termsOfService {\n        ...PolicyFragment\n      }\n    }\n  }\n  #graphql\n  fragment PolicyFragment on ShopPolicy {\n    handle\n    id\n    title\n    body\n    __typename\n  }\n\n': {
    return: ShopQuery;
    variables: ShopQueryVariables;
  };
  '#graphql\n  query Localization($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {\n    shop {\n      paymentSettings {\n        enabledCurrencies: enabledPresentmentCurrencies\n      }\n    }\n    localization {\n      availableCountries {\n        ...CountryFragment\n      }\n      country {\n        ...CountryFragment\n      }\n    }\n  }\n  #graphql\n  fragment CountryFragment on Country {\n    currency {\n      isoCode\n      name\n      symbol\n    }\n    isoCode\n    name\n    unitSystem\n  }\n\n': {
    return: LocalizationQuery;
    variables: LocalizationQueryVariables;
  };
  '#graphql\n            query ProductsSearchFilters(\n              $country: CountryCode\n              $language: LanguageCode\n              $searchTerm: String!\n            ) @inContext(country: $country, language: $language) {\n              search(\n                first: 1,\n                query: $searchTerm,\n                types: PRODUCT,\n              ) {\n                filters: productFilters {\n                  id\n                  label\n                  type\n                  values {\n                    id\n                    label\n                    count\n                    input\n                  }\n                }\n              }\n            }\n\n          ': {
    return: ProductsSearchFiltersQuery;
    variables: ProductsSearchFiltersQueryVariables;
  };
  '#graphql\n            query CollectionFilters(\n              $handle: String!,\n              $country: CountryCode,\n              $language: LanguageCode\n            ) @inContext(country: $country, language: $language) {\n              collection(handle: $handle) {\n                products(first: 1) {\n                  filters {\n                    id\n                    label\n                    type\n                    values {\n                      id\n                      label\n                      count\n                      input\n                    }\n                  }\n                }\n              }\n            }\n          ': {
    return: CollectionFiltersQuery;
    variables: CollectionFiltersQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
