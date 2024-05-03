export const SELLING_PLAN_ALLOCATION_FRAGMENT = `#graphql
  fragment sellingPlanAllocation on SellingPlanAllocation {
    sellingPlan {
      id
      name
      description
      recurringDeliveries
      options {
        name
        value
      }
      priceAdjustments {
        orderCount
        adjustmentValue {
          ... on SellingPlanFixedAmountPriceAdjustment {
            adjustmentAmount {
              amount
              currencyCode
            }
          }
          ... on SellingPlanFixedPriceAdjustment {
            price {
              amount
              currencyCode
            }
          }
          ... on SellingPlanPercentagePriceAdjustment {
            adjustmentPercentage
          }
        }
      }
    }
    priceAdjustments {
      compareAtPrice {
        amount
        currencyCode
      }
      price {
        amount
        currencyCode
      }
      perDeliveryPrice {
        amount
        currencyCode
      }
      unitPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const SELLING_PLAN_GROUP_FRAGMENT = `#graphql
  fragment sellingPlanGroup on SellingPlanGroup {
    name
    appName
    options {
      name
      values
    }
    sellingPlans(first: 10) {
      nodes {
        id
        name
        description
        recurringDeliveries
        options {
          name
          value
        }
        priceAdjustments {
          orderCount
          adjustmentValue {
            ... on SellingPlanFixedAmountPriceAdjustment {
              adjustmentAmount {
                    amount
            currencyCode
              }
            }
            ... on SellingPlanFixedPriceAdjustment {
              price {
                    amount
            currencyCode
              }
            }
            ... on SellingPlanPercentagePriceAdjustment {
              adjustmentPercentage
            }
          }
        }
      }
    }
  }
`;
