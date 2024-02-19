/**
 * This is a catch-all route to redirect url's to 404 that do not match any
 * defined route
 */

export async function loader() {
  throw new Response(null, {status: 404});
}

export default function Route404() {
  return null;
}
