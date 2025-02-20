import { memo } from 'react';
import { Script } from '@shopify/hydrogen';

import { useLoadScript, useRootLoaderData } from '~/hooks';

/**
 * Use useLoadScript hook to lazy load third party scripts.
 * Pass an object with script attributes as first argument. `id` is required
 * Pass 'head' as second argument to load script in the head, if required. Otherwise pass 'body' or undefined
 * Pass a boolean as third argument to conditionally load the script.
 * IMPORTANT: Third party scripts rendered directly, i.e. as <script> tags, will likely cause hydration errors as a gotcha of Remix. Use the useLoadScript hook to avoid this issue.
 */

export const Scripts = memo(() => {
  const { ENV } = useRootLoaderData();

  useLoadScript(
    {
      id: 'gtm-script',
      innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', '${ENV?.PUBLIC_GTM_CONTAINER_ID}');`,
    },
    'body',
    !!ENV?.PUBLIC_GTM_CONTAINER_ID,
  );

  // OneTrust scripts, PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT must be set in .env

  if (ENV?.PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT) {
    console.log('OneTrust script loaded 2');
    useLoadScript(
      {
        id: 'onetrust-script',
        src: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
        async: true,
        type: 'text/javascript',
        charset: 'UTF-8',
        'data-domain-script': ENV.PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT
      },
      'body',
    );

    useLoadScript(
      {
        id: 'onetrust-inline-script',
        innerHTML: `
        function OptanonWrapper() { }
      `,
        type: 'text/javascript',
      },
      'body',
    );
  }

  // ↓ Other third party scripts ↓

  // Example:
  // useLoadScript(
  //   {
  //     id: 'google-script',
  //     src: 'https://www.google.com/someapi.js',
  //   },
  //   'head',
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
