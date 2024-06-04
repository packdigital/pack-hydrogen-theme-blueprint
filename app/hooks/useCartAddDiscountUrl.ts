import {useEffect} from 'react';
import {useCart} from '@shopify/hydrogen-react';
import cookieParser from 'cookie';

const DISCOUNT_COOKIE_NAME = 'discount_code';

const getExpirationDate = () => {
  const now = new Date();
  const time = now.getTime();
  const expireTime = time + 1000 * 86400; // 1 day
  now.setTime(expireTime);
  return now;
};

const deleteCookie = (cookieName: string) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

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
