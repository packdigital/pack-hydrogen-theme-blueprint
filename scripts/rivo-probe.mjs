#!/usr/bin/env node
/*
 * Probe Rivo's Merchant API against a real store and print what each endpoint
 * actually returns, so payload drift surfaces before it reaches the UI.
 *
 * Usage:
 *   npm run rivo:probe                              # shop + catalog only
 *   npm run rivo:probe -- --customer <shopify_id>   # + customer-scoped reads
 *   npm run rivo:probe -- --customer <id> --full    # print full payloads
 *
 * Reads PRIVATE_RIVO_API_KEY (or the legacy PRIVATE_RIVO_STOREFRONT_API_KEY)
 * and RIVO_API_BASE_URL from .env / the environment.
 *
 * Reads only — this script never creates points events or redemptions.
 */

import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const DEFAULT_BASE_URL = 'https://developer-api.rivo.io/merchant_api/v1';

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
    if (depth >= 3) return `{${keys.length} keys}`;
    return `{${keys
      .map((key) => `${key}: ${describe(value[key], depth + 1)}`)
      .join(', ')}}`;
  }
  if (typeof value === 'string') {
    return value.length > 40 ? `"${value.slice(0, 40)}…"` : `"${value}"`;
  }
  return String(value);
};

/**
 * Rivo wraps everything in a JSON:API envelope. Show the `attributes` of the
 * first member, which is what the integration actually normalizes.
 */
const summarize = (json) => {
  if (!json || typeof json !== 'object') return describe(json);
  if (Array.isArray(json.data)) {
    const count = json.data.length;
    if (!count) return 'data: [] (empty)';
    return `data: [${count}] attributes: ${describe(json.data[0]?.attributes ?? json.data[0], 1)}`;
  }
  if (json.data?.attributes) {
    return `attributes: ${describe(json.data.attributes, 1)}`;
  }
  return describe(json, 1);
};

/* Probe ---------- */

const main = async () => {
  const env = loadDotEnv();
  const args = parseArgs(process.argv.slice(2));

  const apiKey =
    env.PRIVATE_RIVO_API_KEY || env.PRIVATE_RIVO_STOREFRONT_API_KEY;
  const baseUrl = (env.RIVO_API_BASE_URL || DEFAULT_BASE_URL).replace(
    /\/$/,
    '',
  );
  const customerId = args.customer || env.RIVO_PROBE_CUSTOMER_ID;

  if (!apiKey) {
    console.error(red('Missing PRIVATE_RIVO_API_KEY.'));
    process.exit(1);
  }

  console.log(`${dim('base    ')} ${baseUrl}`);
  console.log(`${dim('key     ')} ${String(apiKey).slice(0, 4)}…`);
  console.log(
    `${dim('customer')} ${customerId || dim('(none — pass --customer to include customer reads)')}\n`,
  );

  const request = async (path) => {
    const url = `${baseUrl}${path}`;
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          // Raw key — a `Bearer` prefix gets a 401 from this API.
          Authorization: apiKey,
        },
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
    if (result.json !== null) {
      console.log(`       ${dim(summarize(result.json))}`);
      if (args.full) {
        console.log(dim(JSON.stringify(result.json, null, 2)));
      }
    }
    console.log();
    return ok;
  };

  const reads = [
    ['shop', '/shop'],
    ['rewards', '/rewards'],
    ['vip_tiers', '/vip_tiers'],
  ];

  if (customerId) {
    const filter = `filters[customer_identifier]=${customerId}`;
    reads.push(
      ['customer', `/customers/${customerId}`],
      ['points_events', `/points_events?${filter}`],
      ['points_redemptions', `/points_redemptions?${filter}`],
      ['referrals', `/referrals?${filter}`],
    );
  }

  const results = [];
  for (const [label, path] of reads) {
    const result = await request(path);
    const displayPath = customerId ? path.split(customerId).join(':id') : path;
    results.push([label, report(`GET ${displayPath}`, result)]);
  }

  console.log(
    dim(
      'Redemption (POST /points_redemptions) is not probed — it spends real points.\n',
    ),
  );

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
