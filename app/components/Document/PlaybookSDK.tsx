/**
 * Playbook SDK - enables A/B testing and conversion tracking
 * To enable: add PUBLIC_PLAYBOOK_SHOP_ID env variable with your Playbook shop UUID
 * Optional: PUBLIC_PLAYBOOK_SDK_URL to override SDK endpoint (defaults to prod)
 */
export function PlaybookSDK({ENV}: {ENV: Record<string, string>}) {
  if (!ENV.PUBLIC_PLAYBOOK_SHOP_ID) return null;

  return (
    <script
      src={
        ENV.PUBLIC_PLAYBOOK_SDK_URL ||
        'https://playbook-platform-prod.vercel.app/api/sdk'
      }
      data-shop-id={ENV.PUBLIC_PLAYBOOK_SHOP_ID}
      async
    />
  );
}
