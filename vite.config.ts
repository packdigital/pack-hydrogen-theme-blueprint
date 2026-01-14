import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [hydrogen(), oxygen(), reactRouter(), tsconfigPaths()],
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
    external: ['uuid', 'node:crypto', 'react-router-dom/server'],
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
