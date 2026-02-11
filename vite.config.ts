import {defineConfig} from 'vite';
import type {Plugin} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Plugin to redirect vfile's Node.js imports to browser-compatible versions.
 * This fixes "No such module node:path" errors on Oxygen deployment.
 */
function vfileBrowserPlugin(): Plugin {
  return {
    name: 'vfile-browser',
    enforce: 'pre',
    resolveId(id, importer) {
      // Redirect vfile's internal imports to browser versions
      if (importer?.includes('node_modules/vfile/')) {
        // Get the vfile package root directory
        const vfileRoot = importer.substring(
          0,
          importer.indexOf('node_modules/vfile/') +
            'node_modules/vfile/'.length,
        );
        if (id === '#minpath') {
          return {id: vfileRoot + 'lib/minpath.browser.js'};
        }
        if (id === '#minproc') {
          return {id: vfileRoot + 'lib/minproc.browser.js'};
        }
        if (id === '#minurl') {
          return {id: vfileRoot + 'lib/minurl.browser.js'};
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
    vfileBrowserPlugin(),
  ],
  ssr: {
    optimizeDeps: {
      include: [
        '@headlessui/react',
        '@pack/types',
        'cookie',
        'crypto-js/aes',
        'crypto-js/core',
        'crypto-js/hmac-sha256',
        'crypto-js/sha256',
        'debug',
        'fast-deep-equal',
        'fast-xml-parser',
        'hex-to-rgba',
        'lodash/debounce',
        'lodash/kebabCase',
        'lodash/snakeCase',
        'lodash/startCase',
        'react-fast-marquee',
        'react-markdown',
        'react-router',
        'remark-breaks',
        'remark-gfm',
        'sanitize-html',
        'set-cookie-parser',
        'snakecase-keys',
      ],
    },
    resolve: {
      conditions: ['workerd', 'worker', 'browser'],
      externalConditions: ['workerd', 'worker'],
    },
  },
  optimizeDeps: {
    include: [
      '@headlessui/react',
      '@pack/react',
      '@shopify/hydrogen-react',
      'react-intersection-observer',
      'swiper/modules',
      'swiper/react',
    ],
  },
  server: {
    headers: {
      // Allow Private Network Access from public origins (e.g., hosted iframe)
      'Access-Control-Allow-Private-Network': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
    allowedHosts: [],
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
});
