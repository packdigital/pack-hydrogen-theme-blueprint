import {renderToReadableStream} from 'react-dom/server';
import {RemixServer} from '@remix-run/react';
import {isbot} from 'isbot';
import type {EntryContext} from '@shopify/remix-oxygen';

/**
 * Default cache control for HTML pages
 * Uses stale-while-revalidate for better UX while ensuring fresh content
 */
const DEFAULT_HTML_CACHE_CONTROL =
  'public, max-age=60, stale-while-revalidate=86400, stale-if-error=86400';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  // Set default cache control if not already set by the route
  // Routes can override this via their loader's headers
  if (!responseHeaders.has('Cache-Control')) {
    responseHeaders.set('Cache-Control', DEFAULT_HTML_CACHE_CONTROL);
  }

  // Add security and performance headers
  responseHeaders.set('X-Content-Type-Options', 'nosniff');
  responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
