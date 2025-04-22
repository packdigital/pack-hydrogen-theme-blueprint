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
      presets: [hydrogen.preset()],
      ignoredRouteFiles: ['**/.*'],
      future: {
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: [
        '@headlessui/react',
        'react-fast-marquee',
        'hex-to-rgba',
        '@pack/types',
        '@remix-run/dev/server-build',
        'cookie',
        'fast-deep-equal',
        'fast-xml-parser',
        'lodash/debounce',
        'lodash/kebabCase',
        'lodash/snakeCase',
        'lodash/startCase',
        'snakecase-keys',
        'uuid',
        'react-markdown',
        'remark-gfm',
        'remark-breaks',
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
