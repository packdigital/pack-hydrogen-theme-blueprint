import {useEffect} from 'react';
import cookieParser from 'cookie';

import {deleteCookie, getExpirationDate} from '~/lib/utils';
import {useCart} from '~/hooks';

const DISCOUNT_COOKIE_NAME = 'discount_code';

export const useCartAddDiscountUrl = () => {
  const {discountCodesUpdate, id} = useCart();

  useEffect(() => {
    const {search} = window.location;
    const params = new URLSearchParams(search);

    const cookies = cookieParser.parse(document.cookie);
    const cookieDiscountCode = cookies[DISCOUNT_COOKIE_NAME];

    const discountCode =
      params.get('promo') ||
      params.get('discountCode') ||
      params.get(DISCOUNT_COOKIE_NAME) ||
      cookieDiscountCode;

    if (discountCode) {
      document.cookie = `${DISCOUNT_COOKIE_NAME}=${discountCode};expires=${getExpirationDate()?.toUTCString()}`;
    }

    if (discountCode && id) {
      discountCodesUpdate([discountCode]);
      deleteCookie(DISCOUNT_COOKIE_NAME);
    }
  }, [id]);
};
