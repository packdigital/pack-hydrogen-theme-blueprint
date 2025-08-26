import type {Order} from '@shopify/hydrogen/customer-account-api-types';

export type OrderAddressAndStatusProps = {
  order: Order;
};

export type OrderItemsProps = {
  order: Order;
};

export type OrderItemProps = {
  item: Order['lineItems']['edges'][number]['node'];
};

export type OrderTotalsProps = {
  order: Order;
};
