import {renderToReadableStream} from 'react-dom/server';
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  const body = await renderToReadableStream(
    <ServerRouter context={reactRouterContext} url={request.url} />,
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
  // Any uncaught server error — whether it originated in a loader (React
  // Router hands us a 500 here) or during render (onError above) — is
  // temporary. Signal 503 + Retry-After so crawlers back off and re-crawl
  // instead of caching the error page in the SERP.
  if (responseStatusCode >= 500) {
    responseStatusCode = 503;
    responseHeaders.set('Retry-After', '60');
  }
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
