import {afterEach, describe, expect, it, vi} from 'vitest';

import {rivoRequest} from './rivo-client';

/*
 * Retry behaviour. This is the piece that could not be verified against the live
 * store without deliberately rate-limiting it, so it is pinned here instead.
 *
 * The critical asymmetry: a 429 is safe to retry on any method because the
 * request was rejected before any work happened, but a timeout or 5xx on a POST
 * may mean the write landed and only the response was lost — retrying would
 * double-spend points.
 */

const env = {PRIVATE_RIVO_API_KEY: 'test-key'};

/** Queue of responses (or thrown errors) to serve in order. */
const stubResponses = (responses: (Response | (() => Response) | Error)[]) => {
  let call = 0;
  // Params are declared so `mock.calls[n][1]` typechecks when asserting the
  // request shape.
  const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => {
    const next = responses[Math.min(call, responses.length - 1)];
    call += 1;
    if (next instanceof Error) throw next;
    return typeof next === 'function' ? next() : next;
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const ok =
  (body: unknown = {data: {}}) =>
  () =>
    Response.json(body);
const rateLimited = (retryAfter?: string) => () =>
  new Response(JSON.stringify({error: 'rate limited'}), {
    status: 429,
    headers: retryAfter ? {'retry-after': retryAfter} : {},
  });
const serverError = () => () =>
  new Response(JSON.stringify({error: 'boom'}), {status: 500});
const notFound = () => () =>
  new Response(JSON.stringify({error: 'Not Found'}), {status: 404});

afterEach(() => vi.unstubAllGlobals());

describe('rivoRequest — rate limiting', () => {
  it('retries a rate-limited GET and succeeds', async () => {
    const fetchMock = stubResponses([rateLimited('0'), ok({data: {id: 1}})]);

    const {data, error} = await rivoRequest({env, path: '/rewards'});

    expect(error).toBeNull();
    expect(data).toEqual({data: {id: 1}});
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries a rate-limited POST — a 429 means nothing was written', async () => {
    const fetchMock = stubResponses([rateLimited('0'), ok()]);

    const {error} = await rivoRequest({
      env,
      path: '/points_redemptions',
      method: 'POST',
      body: {reward_id: 1},
    });

    expect(error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('gives up after the attempt cap and reports the failure', async () => {
    const fetchMock = stubResponses([rateLimited('0')]);

    const {status, error} = await rivoRequest({env, path: '/rewards'});

    expect(status).toBe(429);
    expect(error).toMatch(/429/);
    // 3 attempts total, not unbounded.
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('honours a Retry-After date without stalling', async () => {
    // A past date yields a non-positive wait, which must fall back to backoff
    // rather than being used directly.
    const past = new Date(Date.now() - 60_000).toUTCString();
    const fetchMock = stubResponses([rateLimited(past), ok()]);

    const {error} = await rivoRequest({env, path: '/rewards'});

    expect(error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('caps a long Retry-After so a page render is not held open', async () => {
    // 3600s must not be obeyed literally; the cap is 2s.
    const started = Date.now();
    stubResponses([rateLimited('3600'), ok()]);

    await rivoRequest({env, path: '/rewards'});

    expect(Date.now() - started).toBeLessThan(4_000);
  });
});

describe('rivoRequest — retry safety by method', () => {
  it('retries a 5xx on GET', async () => {
    const fetchMock = stubResponses([serverError(), ok()]);
    const {error} = await rivoRequest({env, path: '/rewards'});
    expect(error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry a 5xx on POST — the write may have landed', async () => {
    // This is the double-spend guard. If it regresses, a 500 on
    // /points_redemptions could spend points twice.
    const fetchMock = stubResponses([serverError(), ok()]);

    const {error} = await rivoRequest({
      env,
      path: '/points_redemptions',
      method: 'POST',
      body: {reward_id: 1},
    });

    expect(error).toMatch(/500/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does NOT retry a network failure on POST', async () => {
    const fetchMock = stubResponses([new TypeError('fetch failed'), ok()]);

    const {error} = await rivoRequest({
      env,
      path: '/points_events',
      method: 'POST',
      body: {source: 'tiktok_follow'},
    });

    expect(error).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a network failure on GET', async () => {
    const fetchMock = stubResponses([new TypeError('fetch failed'), ok()]);
    const {error} = await rivoRequest({env, path: '/rewards'});
    expect(error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('never retries a 4xx — it will not change', async () => {
    const fetchMock = stubResponses([notFound()]);
    const {status} = await rivoRequest({env, path: '/nope'});
    expect(status).toBe(404);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('rivoRequest — request shape', () => {
  it('sends the key raw, with no Bearer prefix', async () => {
    // A Bearer prefix 401s on Rivo's Merchant API.
    const fetchMock = stubResponses([ok()]);
    await rivoRequest({env, path: '/rewards'});

    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<
      string,
      string
    >;
    expect(headers.Authorization).toBe('test-key');
    expect(headers.Authorization).not.toMatch(/^Bearer/);
  });

  it('flattens nested params into Rivo’s bracket syntax', async () => {
    const fetchMock = stubResponses([ok()]);
    await rivoRequest({
      env,
      path: '/points_events',
      searchParams: {
        filters: {customer_identifier: 123},
        pagination: {per_page: 25, page: undefined},
      },
    });

    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain('filters%5Bcustomer_identifier%5D=123');
    expect(url).toContain('pagination%5Bper_page%5D=25');
    // Undefined values are omitted rather than sent as "undefined".
    expect(url).not.toContain('page=');
  });

  it('form-encodes the body and drops empty values', async () => {
    const fetchMock = stubResponses([ok()]);
    await rivoRequest({
      env,
      path: '/points_events',
      method: 'POST',
      body: {
        source: 'tiktok_follow',
        custom_action_name: undefined,
        skip_email: true,
      },
    });

    const init = fetchMock.mock.calls[0]?.[1];
    expect((init?.headers as Record<string, string>)['Content-Type']).toBe(
      'application/x-www-form-urlencoded',
    );
    expect(init?.body).toBe('source=tiktok_follow&skip_email=true');
  });

  it('redacts the key from error messages', async () => {
    // Errors reach the browser, so the key must never appear in one.
    stubResponses([
      () =>
        new Response(JSON.stringify({error: 'bad key test-key'}), {
          status: 403,
        }),
    ]);
    const {error} = await rivoRequest({env, path: '/rewards'});

    expect(error).not.toContain('test-key');
    expect(error).toContain('[redacted]');
  });

  it('fails clearly when no key is configured', async () => {
    const {status, error} = await rivoRequest({env: {}, path: '/rewards'});
    expect(status).toBe(500);
    expect(error).toMatch(/PRIVATE_RIVO_API_KEY/);
  });

  it('reports a non-JSON body as a bad gateway rather than throwing', async () => {
    stubResponses([
      () => new Response('<html>maintenance</html>', {status: 200}),
    ]);
    const {status, error} = await rivoRequest({env, path: '/rewards'});
    expect(status).toBe(502);
    expect(error).toMatch(/non-JSON/i);
  });
});
