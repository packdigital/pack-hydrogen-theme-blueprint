/**
 * Playbook SDK - enables A/B testing and conversion tracking
 * To enable: add PUBLIC_PLAYBOOK_SHOP_ID env variable with your Playbook shop UUID
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

  // Proxy enabled by default — routes API calls through the store's own domain,
  // making requests first-party and invisible to ad blockers.
  // Set PUBLIC_PLAYBOOK_PROXY_ENABLED=false to send API calls direct to heyplaybook.com.
  const useProxy = ENV.PUBLIC_PLAYBOOK_PROXY_ENABLED !== 'false';
  const sdkUrl = ENV.PUBLIC_PLAYBOOK_SDK_URL || 'https://cdn.heyplaybook.com/playbook.js';
  const apiEndpoint = useProxy
    ? '/apps/playbook'
    : 'https://www.heyplaybook.com';

  // Cookie consent: set PUBLIC_PLAYBOOK_CONSENT_REQUIRED=true ONLY if this store
  // runs a consent manager (Transcend Airgap, OneTrust, Shopify's own banner, …).
  // It tells the SDK to WAIT for Shopify's Customer Privacy API before recording
  // anything, instead of auto-detecting it. On a headless store the CMP often
  // initializes Shopify.customerPrivacy AFTER the SDK boots, and a first-time
  // visitor has no _tracking_consent cookie yet — so without this the SDK could
  // fail open and record one pageview before the banner is answered. Leave it
  // unset on stores with no CMP (nothing to wait for). See PLAYBOOK.md → Cookie
  // consent. Vendor-neutral: any CMP that writes to Shopify's API works.
  const consentRequired = ENV.PUBLIC_PLAYBOOK_CONSENT_REQUIRED === 'true';

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
      <script
        src={sdkUrl}
        data-pb-config={JSON.stringify({
          shopId: ENV.PUBLIC_PLAYBOOK_SHOP_ID,
          apiEndpoint,
        })}
        // Present only when a consent manager runs on this store — see the
        // consentRequired comment above. Omitted entirely otherwise.
        data-pb-consent={consentRequired ? 'required' : undefined}
        async
      />
    </>
  );
}
