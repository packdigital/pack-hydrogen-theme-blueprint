#!/usr/bin/env node
/*
 * Probe Rivo's storefront API against a real store and print what each endpoint
 * actually returns, so payload drift surfaces before it reaches the UI.
 *
 * Usage:
 *   npm run rivo:probe -- --customer <shopify_customer_id>
 *   npm run rivo:probe -- --customer 1234 --spend <reward_id>   # spends real points
 *
 * Reads PRIVATE_RIVO_STOREFRONT_API_KEY, PRIVATE_RIVO_SHOP_DOMAIN (or
 * PUBLIC_STORE_DOMAIN) and RIVO_API_BASE_URL from .env / the environment.
 */

import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const DEFAULT_BASE_URL = 'https://loyalty-api.rivo.io';

/* Env ---------- */

const loadDotEnv = () => {
  const env = {};
  for (const file of ['.env', '.env.local']) {
    let contents;
    try {
      contents = readFileSync(resolve(process.cwd(), file), 'utf8');
    } catch {
      continue;
    }
    for (const rawLine of contents.split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const index = line.indexOf('=');
      if (index === -1) continue;
      const key = line.slice(0, index).trim();
      let value = line.slice(index + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }
  return {...env, ...process.env};
};

/* Args ---------- */

const parseArgs = (argv) => {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
};

/* Output ---------- */

const color = (code, text) => `\u001b[${code}m${text}\u001b[0m`;
const green = (text) => color('32', text);
const red = (text) => color('31', text);
const yellow = (text) => color('33', text);
const dim = (text) => color('2', text);

/** One-line shape of a payload, so long responses stay readable. */
const describe = (value, depth = 0) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return depth >= 2
      ? `[${value.length} items]`
      : `[${value.length} × ${describe(value[0], depth + 1)}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (depth >= 2) return `{${keys.length} keys}`;
    return `{${keys
      .map((key) => `${key}: ${describe(value[key], depth + 1)}`)
      .join(', ')}}`;
  }
  if (typeof value === 'string') {
    return value.length > 40 ? `"${value.slice(0, 40)}…"` : `"${value}"`;
  }
  return String(value);
};

/* Probe ---------- */

const main = async () => {
  const env = loadDotEnv();
  const args = parseArgs(process.argv.slice(2));

  const apiKey = env.PRIVATE_RIVO_STOREFRONT_API_KEY;
  const shop = env.PRIVATE_RIVO_SHOP_DOMAIN || env.PUBLIC_STORE_DOMAIN;
  const baseUrl = (env.RIVO_API_BASE_URL || DEFAULT_BASE_URL).replace(
    /\/$/,
    '',
  );
  const customerId = args.customer || env.RIVO_PROBE_CUSTOMER_ID;

  const missing = [];
  if (!apiKey) missing.push('PRIVATE_RIVO_STOREFRONT_API_KEY');
  if (!shop) missing.push('PRIVATE_RIVO_SHOP_DOMAIN or PUBLIC_STORE_DOMAIN');
  if (!customerId) missing.push('--customer <shopify_customer_id>');

  if (missing.length) {
    console.error(red('Missing required config:'));
    missing.forEach((item) => console.error(`  - ${item}`));
    process.exit(1);
  }

  console.log(`${dim('base  ')} ${baseUrl}`);
  console.log(`${dim('shop  ')} ${shop}`);
  console.log(`${dim('customer')} ${customerId}`);
  console.log(`${dim('key   ')} ${String(apiKey).slice(0, 4)}…\n`);

  const request = async (method, path, body) => {
    const url = new URL(`${baseUrl}${path}`);
    url.searchParams.set('shop', shop);
    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          ...(body ? {'Content-Type': 'application/json'} : {}),
        },
        ...(body ? {body: JSON.stringify(body)} : {}),
      });
      const text = await response.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        return {status: response.status, raw: text.slice(0, 200), json: null};
      }
      return {status: response.status, json, raw: null};
    } catch (error) {
      return {status: 0, error: error.message, json: null};
    }
  };

  const report = (label, result) => {
    const ok = result.status >= 200 && result.status < 300;
    const badge = ok
      ? green(`${result.status} OK`)
      : result.status === 0
        ? red('NETWORK')
        : red(String(result.status));
    console.log(`${badge}  ${label}`);
    if (result.error) console.log(`       ${red(result.error)}`);
    if (result.raw) console.log(`       ${yellow(`non-JSON: ${result.raw}`)}`);
    if (result.json !== null)
      console.log(`       ${dim(describe(result.json))}`);
    console.log();
    return ok;
  };

  const reads = [
    ['status', `/api/customers/${customerId}/status`],
    ['properties', `/api/customers/${customerId}/properties`],
    ['vip_tiers', `/api/customers/${customerId}/vip_tiers`],
    ['points_logs', `/api/customers/${customerId}/points_logs`],
    ['credits_logs', `/api/customers/${customerId}/credits_logs`],
    ['referrals', `/api/customers/${customerId}/referrals`],
    ['referral_stats', `/api/customers/${customerId}/referral_stats`],
    // Shop-scoped, not customer-scoped: /api/customers/:id/rewards 404s.
    ['rewards', '/api/rewards'],
  ];

  const results = [];
  for (const [label, path] of reads) {
    const result = await request('GET', path);
    results.push([
      label,
      report(`GET ${path.replace(customerId, ':id')}`, result),
    ]);
  }

  if (args.spend) {
    console.log(yellow('--spend passed: this consumes real points.\n'));
    const result = await request(
      'POST',
      `/api/customers/${customerId}/spend_points`,
      {reward_name: String(args.spend)},
    );
    results.push([
      'spend_points',
      report(`POST /api/customers/:id/spend_points`, result),
    ]);
    const code = result.json?.points_purchase?.code;
    if (code) {
      console.log(`${green('discount code')} ${code}`);
      console.log(
        dim('Apply with cartDiscountCodesUpdate to verify the cart path.\n'),
      );
    }
  } else {
    console.log(
      dim(
        'spend_points skipped. Pass --spend <reward_id> to test a redemption.\n',
      ),
    );
  }

  const failed = results.filter(([, ok]) => !ok);
  console.log(
    `${results.length - failed.length}/${results.length} endpoints returned 2xx`,
  );
  if (failed.length) {
    console.log(red(`failing: ${failed.map(([label]) => label).join(', ')}`));
  }
  process.exit(failed.length ? 1 : 0);
};

main().catch((error) => {
  console.error(red(error.stack || error.message));
  process.exit(1);
});
