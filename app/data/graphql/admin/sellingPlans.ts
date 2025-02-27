// Docs: https://shopify.dev/docs/api/admin-graphql/2025-01/objects/sellingplan

export const ADMIN_SELLING_PLAN_FRAGMENT = `
  fragment AdminSellingPlanFragment on SellingPlan {
    id
    name
    description
    options
    deliveryPolicy {
      ... on SellingPlanFixedDeliveryPolicy {
        fixedIntent: intent
      }
      ... on SellingPlanRecurringDeliveryPolicy {
        recurringIntent: intent
      }
    }
    pricingPolicies {
      ... on SellingPlanFixedPricingPolicy {
        __typename
        adjustmentType
        adjustmentValue {
          ... on MoneyV2 {
            __typename
            amount
            currencyCode
          }
          ... on SellingPlanPricingPolicyPercentageValue {
            __typename
            percentage
          }
        }
      }
      ... on SellingPlanRecurringPricingPolicy {
        adjustmentType
        adjustmentValue {
          ... on MoneyV2 {
            __typename
            amount
            currencyCode
          }
          ... on SellingPlanPricingPolicyPercentageValue {
            __typename
            percentage
          }
        }
      }
    }
  }
`;
