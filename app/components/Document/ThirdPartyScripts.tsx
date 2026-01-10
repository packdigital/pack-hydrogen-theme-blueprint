/**
 * ThirdPartyScripts - Centralized component for loading third-party widgets and scripts
 *
 * This component provides optimized loading strategies for non-critical third-party scripts
 * like chat widgets, tracking pixels, and other external services.
 *
 * Loading strategies:
 * - `idle`: Uses requestIdleCallback to load during browser idle time (default)
 * - `interaction`: Loads after user interaction (scroll, click, touch)
 * - `delay`: Loads after a specified delay in milliseconds
 * - `visible`: Loads when the component enters the viewport
 *
 * Usage:
 * 1. Add environment variables for each third-party service
 * 2. Configure the loading strategy appropriate for each service
 * 3. Non-critical widgets should use 'interaction' or 'idle' strategies
 *
 * Example environment variables:
 * - PUBLIC_WARMLY_WIDGET_ID: Warmly chat widget ID
 * - PUBLIC_LIVEINTENT_PIXEL_ID: LiveIntent tracking pixel ID
 * - PUBLIC_INTERCOM_APP_ID: Intercom chat widget ID
 */

import {useEffect, useState} from 'react';
import {useInView} from 'react-intersection-observer';

import {useRootLoaderData} from '~/hooks';

type LoadStrategy = 'idle' | 'interaction' | 'delay' | 'visible';

interface ScriptConfig {
  id: string;
  src?: string;
  innerHTML?: string;
  strategy: LoadStrategy;
  delay?: number;
  enabled: boolean;
}

/**
 * Schedules script loading during browser idle time
 */
function scheduleIdleLoad(callback: () => void, timeout = 3000): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, {timeout});
  } else {
    setTimeout(callback, 200);
  }
}

/**
 * Waits for user interaction before executing callback
 */
function waitForInteraction(callback: () => void): () => void {
  const events = ['scroll', 'click', 'touchstart', 'keydown', 'mousemove'];
  let triggered = false;

  const handler = () => {
    if (triggered) return;
    triggered = true;
    events.forEach((event) =>
      document.removeEventListener(event, handler, {capture: true}),
    );
    // Add small delay after interaction to not compete with interaction handling
    setTimeout(callback, 100);
  };

  events.forEach((event) =>
    document.addEventListener(event, handler, {capture: true, passive: true}),
  );

  return () => {
    events.forEach((event) =>
      document.removeEventListener(event, handler, {capture: true}),
    );
  };
}

const SCRIPTS_LOADED: Record<string, boolean> = {};

function loadExternalScript(config: ScriptConfig): void {
  if (SCRIPTS_LOADED[config.id]) return;

  const script = document.createElement('script');
  script.id = config.id;
  script.type = 'text/javascript';

  if (config.src) {
    script.src = config.src;
    script.async = true;
    script.defer = true;
  }

  if (config.innerHTML) {
    script.innerHTML = config.innerHTML;
  }

  document.body.appendChild(script);
  SCRIPTS_LOADED[config.id] = true;
}

/**
 * Hook to load a script with the specified strategy
 */
function useStrategyLoader(config: ScriptConfig, isVisible = false): void {
  useEffect(() => {
    if (!config.enabled || SCRIPTS_LOADED[config.id]) return;

    const load = () => loadExternalScript(config);
    let cleanup: (() => void) | undefined;

    switch (config.strategy) {
      case 'idle':
        scheduleIdleLoad(load, config.delay || 3000);
        break;
      case 'interaction':
        cleanup = waitForInteraction(load);
        break;
      case 'delay':
        const timeoutId = setTimeout(load, config.delay || 2000);
        cleanup = () => clearTimeout(timeoutId);
        break;
      case 'visible':
        if (isVisible) load();
        break;
    }

    return cleanup;
  }, [config.enabled, config.id, config.strategy, isVisible]);
}

/**
 * Warmly Widget - B2B chat and lead capture widget
 * Loaded on user interaction to avoid impacting initial page load
 */
function WarmlyWidget({widgetId}: {widgetId: string}) {
  useStrategyLoader({
    id: 'warmly-widget',
    innerHTML: `
      (function(w,d,i){
        w.warmly=w.warmly||function(){(w.warmly.q=w.warmly.q||[]).push(arguments)};
        w.warmly.l=+new Date;
        var s=d.createElement('script');s.async=1;
        s.src='https://cdn.getwarmly.com/warmly.min.js';
        s.setAttribute('data-warmly-id','${widgetId}');
        var f=d.getElementsByTagName('script')[0];f.parentNode.insertBefore(s,f);
      })(window,document);
    `,
    strategy: 'interaction',
    enabled: !!widgetId,
  });

  return null;
}

/**
 * LiveIntent Tracking Pixel - Advertising and identity resolution
 * Loaded during browser idle time to minimize performance impact
 */
function LiveIntentPixel({pixelId}: {pixelId: string}) {
  useStrategyLoader({
    id: 'liveintent-pixel',
    innerHTML: `
      (function(l,i,v,e,I,n,t){
        l[I]=l[I]||function(){(l[I].q=l[I].q||[]).push(arguments)};
        l[I].l=+new Date;n=i.createElement(v);t=i.getElementsByTagName(v)[0];
        n.async=1;n.src=e;t.parentNode.insertBefore(n,t);
      })(window,document,'script','https://b-code.liadm.com/a-${pixelId}.min.js','li_cnep');
      li_cnep('init');
    `,
    strategy: 'idle',
    delay: 3000,
    enabled: !!pixelId,
  });

  return null;
}

/**
 * Generic third-party script loader for custom integrations
 * Add new widgets here following the same pattern
 */
function CustomScript({
  id,
  src,
  innerHTML,
  strategy = 'idle',
  delay,
  enabled,
}: ScriptConfig) {
  const {ref, inView} = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  });

  useStrategyLoader({id, src, innerHTML, strategy, delay, enabled}, inView);

  if (strategy === 'visible') {
    return <div ref={ref} style={{display: 'none'}} />;
  }

  return null;
}

/**
 * Main ThirdPartyScripts component
 * Add environment variable checks and widget configurations here
 */
export function ThirdPartyScripts() {
  const {ENV} = useRootLoaderData();

  // Check for enabled third-party services via environment variables
  const warmlyWidgetId = ENV.PUBLIC_WARMLY_WIDGET_ID;
  const liveIntentPixelId = ENV.PUBLIC_LIVEINTENT_PIXEL_ID;

  return (
    <>
      {/* Warmly Widget - loaded on user interaction */}
      {warmlyWidgetId && <WarmlyWidget widgetId={warmlyWidgetId} />}

      {/* LiveIntent Pixel - loaded during browser idle */}
      {liveIntentPixelId && <LiveIntentPixel pixelId={liveIntentPixelId} />}

      {/*
       * Add additional third-party scripts here using CustomScript component:
       *
       * Example - Intercom chat widget:
       * {ENV.PUBLIC_INTERCOM_APP_ID && (
       *   <CustomScript
       *     id="intercom-widget"
       *     innerHTML={`
       *       window.intercomSettings = { app_id: '${ENV.PUBLIC_INTERCOM_APP_ID}' };
       *       (function(){var w=window;var ic=w.Intercom;...})();
       *     `}
       *     strategy="interaction"
       *     enabled={!!ENV.PUBLIC_INTERCOM_APP_ID}
       *   />
       * )}
       */}
    </>
  );
}

ThirdPartyScripts.displayName = 'ThirdPartyScripts';
