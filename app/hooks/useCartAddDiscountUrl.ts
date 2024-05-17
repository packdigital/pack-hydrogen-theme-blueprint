import {useEffect} from 'react';
import {useCart} from '@shopify/hydrogen-react';

export const useCartAddDiscountUrl = () => {
  const {discountCodesUpdate, id} = useCart();

  useEffect(() => {
    const {search} = window.location;
    const params = new URLSearchParams(search);

    const discountCode =
      params.get('promo') ||
      params.get('discountCode') ||
      params.get('discount_code');

    if (discountCode && id) {
      discountCodesUpdate([discountCode]);
    }
  }, [id]);
};
