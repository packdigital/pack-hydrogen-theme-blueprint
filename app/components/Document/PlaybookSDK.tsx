/**
 * Playbook SDK - enables A/B testing and conversion tracking
 * To enable: add PUBLIC_PLAYBOOK_SHOP_ID env variable with your Playbook shop UUID
 * Optional: PUBLIC_PLAYBOOK_SDK_URL to override SDK endpoint (defaults to prod)
 *
 * Anti-flicker: Hides page when Playbook params present, reveals when SDK ready
 */
export function PlaybookSDK({ENV}: {ENV: Record<string, string>}) {
  if (!ENV.PUBLIC_PLAYBOOK_SHOP_ID) return null;

  const sdkUrl =
    ENV.PUBLIC_PLAYBOOK_SDK_URL || 'https://www.heyplaybook.com/sdk/playbook.js';

  // Anti-flicker inline script - runs synchronously before hydration
  const antiFlickerScript = `
    (function(){
      var search = location.search;
      var hasPlaybookParams = search.indexOf('_pv=') > -1 || search.indexOf('pbk=') > -1 || search.indexOf('pb_mode=brand_preview') > -1 || search.indexOf('_preview=true') > -1;
      var isHidden = false;
      var timeoutId = null;

      if (hasPlaybookParams) {
        document.documentElement.style.visibility = 'hidden';
        isHidden = true;
        // Failsafe: reveal after 3s if SDK doesn't load
        timeoutId = setTimeout(function() {
          document.documentElement.style.visibility = '';
          isHidden = false;
        }, 3000);
      }

      // Expose pageReady for SDK to call when done
      window.Playbook = window.Playbook || {};
      window.Playbook.pageReady = function() {
        if (timeoutId) clearTimeout(timeoutId);
        if (isHidden) {
          document.documentElement.style.visibility = '';
          isHidden = false;
        }
      };
    })();
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{__html: antiFlickerScript}} />
      <script src={sdkUrl} data-shop-id={ENV.PUBLIC_PLAYBOOK_SHOP_ID} async />
    </>
  );
}
