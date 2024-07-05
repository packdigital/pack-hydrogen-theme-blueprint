import {json, redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const to = String(searchParams.get('to') || '');
  const status = Number(searchParams.get('status'));

  if (!to) return json({errors: ['Missing `to` parameter']}, {status: 400});

  return status ? redirect(to, {status}) : redirect(to);
}
