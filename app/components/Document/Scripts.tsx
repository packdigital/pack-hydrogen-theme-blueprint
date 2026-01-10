import {memo} from 'react';
import {Script} from '@shopify/hydrogen';

import {useLoadScript, useRootLoaderData} from '~/hooks';

/**
 * Use useLoadScript hook to lazy load third party scripts.
 *
 * Parameters:
 * 1. Script attributes object (id is required)
 * 2. Placement: 'head' | 'body' (default: 'body')
 * 3. Ready boolean: conditionally load the script
 * 4. DeferOptions (optional): { useIdleCallback, delay, loadOnInteraction }
 *
 * Deferred Loading Strategies:
 * - useIdleCallback: true - Load during browser idle time (best for non-critical scripts)
 * - delay: 2000 - Load after specified milliseconds
 * - loadOnInteraction: true - Load after user scroll/click/touch
 *
 * IMPORTANT: Third party scripts rendered directly as <script> tags will cause
 * hydration errors in Remix. Always use useLoadScript hook instead.
 */

export const Scripts = memo(() => {
  const {ENV} = useRootLoaderData();

  // GTM script - loaded with requestIdleCallback for better performance
  useLoadScript(
    {
      id: 'gtm-script',
      innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', '${ENV.PUBLIC_GTM_CONTAINER_ID}');`,
    },
    'body',
    !!ENV.PUBLIC_GTM_CONTAINER_ID,
    {useIdleCallback: true}, // Defer to browser idle time for better performance
  );

  // ↓ Other third party scripts ↓

  // Example - Load during browser idle time (non-critical analytics):
  // useLoadScript(
  //   {id: 'analytics', src: 'https://analytics.example.com/script.js'},
  //   'body',
  //   true,
  //   {useIdleCallback: true}
  // );

  // Example - Load after user interaction (chat widgets):
  // useLoadScript(
  //   {id: 'chat-widget', src: 'https://chat.example.com/widget.js'},
  //   'body',
  //   true,
  //   {loadOnInteraction: true}
  // );

  // Example - Load after delay (low priority tracking):
  // useLoadScript(
  //   {id: 'tracking', src: 'https://tracking.example.com/pixel.js'},
  //   'body',
  //   true,
  //   {delay: 3000}
  // );

  return (
    // Adds all env vars prefixed with PUBLIC_ to the window for client-side use
    <Script
      dangerouslySetInnerHTML={{
        __html: `window.ENV = ${JSON.stringify(ENV)}`,
      }}
    />
  );
});

Scripts.displayName = 'Scripts';
