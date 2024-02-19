import {Script} from '@shopify/hydrogen';

import {useIsHydrated, useRootLoaderData} from '~/hooks';

export function Scripts() {
  const {ENV} = useRootLoaderData();
  const isHydrated = useIsHydrated();

  return (
    <>
      {/* Adds all env vars prefixed with PUBLIC_ to the window for client-side use */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />

      {isHydrated && ENV?.PUBLIC_GTM_CONTAINER_ID && (
        <Script
          id="gtm-script"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${ENV.PUBLIC_GTM_CONTAINER_ID}');`,
          }}
        />
      )}

      {/* other third-party scripts */}
    </>
  );
}

Scripts.displayName = 'Scripts';
