import {json, redirect} from '@shopify/remix-oxygen';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request}: ActionFunctionArgs) {
  let body;
  try {
    body = await request.formData();
  } catch (error) {}
  const to = String(body?.get('to') || '');
  const status = Number(body?.get('status'));
  const headersString = String(body?.get('headers') || '');
  const headers = JSON.parse(headersString);

  if (!to) return json({errors: ['Missing `to` in body']}, {status: 400});

  return status ? redirect(to, {status, headers}) : redirect(to, {headers});
}
