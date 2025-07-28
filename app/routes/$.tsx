import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

/**
 * This is a catch-all route to redirect url's to 404 that do not match any
 * defined route
 */

export async function loader({request}: LoaderFunctionArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function Route404() {
  return null;
}
