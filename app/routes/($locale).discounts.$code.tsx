import {useEffect} from 'react';
import {json, redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {getSeoMeta} from '@shopify/hydrogen';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';

export async function loader({request, params}: LoaderFunctionArgs) {
  const {code, locale} = params;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let redirectParam =
    searchParams.get('redirect') || searchParams.get('return_to') || '/';

  if (redirectParam.includes('//')) {
    // Avoid redirecting to external URLs to prevent phishing attacks
    redirectParam = '/';
  }

  searchParams.delete('redirect');
  searchParams.delete('return_to');

  const redirectUrl = `${
    locale ? `/${locale}` : ''
  }${redirectParam}?${searchParams}`;

  if (!code) {
    return redirect(redirectUrl);
  }

  return json({
    code,
    redirectUrl,
    seo: {robots: {noIndex: true, noFollow: true}},
  });
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function DiscountsRoute() {
  const {code, redirectUrl} = useLoaderData<typeof loader>();
  const {discountCodesUpdate} = useCart();
  const navigate = useNavigate();

  // Because useCart hook is being used, the codes update mutation must be done client side
  useEffect(() => {
    if (!code) return;
    discountCodesUpdate([code]);
    navigate(`${redirectUrl}`, {replace: true});
  }, [code, discountCodesUpdate, redirectUrl]);

  return null;
}

DiscountsRoute.displayName = 'DiscountsRoute';
