import {useEffect} from 'react';
import {useCart} from '@shopify/hydrogen-react';

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

    let cookieDiscountCode: boolean | string = false;

    document.cookie?.split(/\s*;\s*/).find((cookie) => {
      const [key, value] = cookie.split(/\s*=\s*/);
      if (key !== 'discount_code') return false;
      cookieDiscountCode = value;
      return true;
    });

    const discountCode =
      params.get('promo') ||
      params.get('discountCode') ||
      params.get('discount_code') ||
      cookieDiscountCode;

    if (discountCode) {
      document.cookie = `discount_code=${discountCode};expires=${getExpirationDate()?.toUTCString()}`;
    }

    if (discountCode && id) {
      discountCodesUpdate([discountCode]);
      deleteCookie('discount_code');
    }
  }, [id]);
};
