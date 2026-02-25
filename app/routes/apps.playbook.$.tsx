import type {LoaderFunctionArgs, ActionFunctionArgs} from 'react-router';

const PLATFORM_URL_DEFAULT = 'https://www.heyplaybook.com';

/**
 * Headers to forward from the client request to the Playbook platform.
 * Omits hop-by-hop headers and host (which would be wrong for the backend).
 */
const FORWARDED_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'content-type',
  'referer',
  'user-agent',
  'x-forwarded-for',
];

/**
 * Headers to forward from the platform response back to the client.
 * Omits transfer-encoding (chunked encoding is re-applied by the runtime).
 */
const FORWARDED_RESPONSE_HEADERS = ['content-type', 'cache-control', 'etag'];

function buildBackendUrl(request: Request, env: Env): string {
  const platformUrl = env.PLAYBOOK_PLATFORM_URL || PLATFORM_URL_DEFAULT;
  const url = new URL(request.url);

  // Extract the sub-path after /apps/playbook/
  // e.g., /apps/playbook/sdk → "sdk"
  //        /apps/playbook/api/hero → "api/hero"
  const proxyPrefix = '/apps/playbook/';
  const idx = url.pathname.indexOf(proxyPrefix);
  const subPath = idx !== -1 ? url.pathname.slice(idx + proxyPrefix.length) : '';

  // Map paths:
  //   "sdk"      → /api/sdk        (the compiled SDK JS)
  //   "api/..."  → /api/...        (all API routes)
  //   anything else → /api/{path}  (fallback)
  let backendPath: string;
  if (subPath === 'sdk' || subPath === 'sdk/playbook.js') {
    backendPath = '/api/sdk';
  } else if (subPath.startsWith('api/')) {
    backendPath = `/${subPath}`;
  } else {
    backendPath = `/api/${subPath}`;
  }

  const backendUrl = new URL(backendPath, platformUrl);
  // Forward query params
  backendUrl.search = url.search;
  return backendUrl.toString();
}

async function proxyRequest(request: Request, env: Env): Promise<Response> {
  const backendUrl = buildBackendUrl(request, env);

  // Build headers to forward
  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  // Identify as proxy
  headers.set('x-forwarded-host', new URL(request.url).host);

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  // Forward body for non-GET requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const backendResponse = await fetch(backendUrl, init);

  // Build response headers
  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = backendResponse.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  // Add CORS headers — the storefront domain is always same-origin,
  // but include these for consistency with direct platform responses
  responseHeaders.set('access-control-allow-origin', '*');
  responseHeaders.set(
    'access-control-allow-methods',
    'GET, POST, OPTIONS',
  );
  responseHeaders.set(
    'access-control-allow-headers',
    'Content-Type',
  );

  // SDK responses get aggressive caching; API responses don't
  const url = new URL(request.url);
  const isSdkRequest =
    url.pathname.endsWith('/sdk') ||
    url.pathname.endsWith('/sdk/playbook.js');
  if (isSdkRequest && backendResponse.ok) {
    responseHeaders.set(
      'cache-control',
      'public, max-age=3600, s-maxage=3600',
    );
  } else if (!isSdkRequest) {
    responseHeaders.set('cache-control', 'no-store');
  }

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export async function loader({request, context}: LoaderFunctionArgs) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'Content-Type',
        'access-control-max-age': '86400',
      },
    });
  }

  try {
    return await proxyRequest(request, context.env);
  } catch (error) {
    console.error('[Playbook Proxy] Backend request failed:', error);
    return new Response('Bad Gateway', {status: 502});
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  try {
    return await proxyRequest(request, context.env);
  } catch (error) {
    console.error('[Playbook Proxy] Backend request failed:', error);
    return new Response('Bad Gateway', {status: 502});
  }
}
