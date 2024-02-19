import {json, redirect} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request}: ActionFunctionArgs) {
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const to = String(body?.get('to') || '');
  const status = Number(body?.get('status'));

  if (!to) return json({errors: ['Missing `to` in body']}, {status: 400});

  return status ? redirect(to, {status}) : redirect(to);
}
