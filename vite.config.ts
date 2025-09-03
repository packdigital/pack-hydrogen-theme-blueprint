import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.v3preset()],
      ignoredRouteFiles: ['**/.*'],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_routeConfig: true,
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: [
        '@headlessui/react',
        '@pack/types',
        '@remix-run/dev/server-build',
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
        'remark-breaks',
        'remark-gfm',
        'sanitize-html',
        'set-cookie-parser',
        'snakecase-keys',
        'uuid',
      ],
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
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
});
