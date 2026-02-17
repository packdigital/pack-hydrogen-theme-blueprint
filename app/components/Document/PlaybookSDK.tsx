/**
 * Playbook SDK - enables A/B testing and conversion tracking
 * To enable: add PUBLIC_PLAYBOOK_SHOP_ID env variable with your Playbook shop UUID
 * Optional: PUBLIC_PLAYBOOK_SDK_URL to override SDK endpoint (defaults to prod)
 *
 * Anti-flicker: Conditionally server-renders a <style> tag when Playbook params
 * are present (determined by the root loader). This survives React hydration
 * (React manages it) and uses opacity (can't be overridden by child elements).
 */
export function PlaybookSDK({
  ENV,
  hasPlaybookParams,
}: {
  ENV: Record<string, string>;
  hasPlaybookParams?: boolean;
}) {
  if (!ENV.PUBLIC_PLAYBOOK_SHOP_ID) return null;

  const sdkUrl =
    ENV.PUBLIC_PLAYBOOK_SDK_URL || 'https://www.heyplaybook.com/sdk/playbook.js';

  const revealScript = `
    (function(){
      function reveal() {
        document.documentElement.classList.add('pb-ready');
        if (window.__pbFlickerTimeout) {
          clearTimeout(window.__pbFlickerTimeout);
          window.__pbFlickerTimeout = null;
        }
      }

      ${hasPlaybookParams ? 'window.__pbFlickerTimeout = setTimeout(reveal, 3000);' : ''}

      window.Playbook = window.Playbook || {};
      window.Playbook.pageReady = reveal;
    })();
  `;

  return (
    <>
      {hasPlaybookParams && (
        <style
          id="pb-anti-flicker"
          dangerouslySetInnerHTML={{
            __html:
              'html:not(.pb-ready){opacity:0!important}html.pb-ready{opacity:1!important;transition:opacity 0.3s ease-in!important}',
          }}
        />
      )}
      <script dangerouslySetInnerHTML={{__html: revealScript}} />
      <script src={sdkUrl} data-shop-id={ENV.PUBLIC_PLAYBOOK_SHOP_ID} async />
    </>
  );
}
