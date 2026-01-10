import type {RefObject} from 'react';
import {useState, useEffect} from 'react';

const SCRIPTS_LOADED: Record<string, Promise<boolean>> = {};

/**
 * Options for deferred script loading to improve page performance
 */
export interface DeferOptions {
  /** Use requestIdleCallback to load during browser idle time */
  useIdleCallback?: boolean;
  /** Delay in milliseconds before loading the script */
  delay?: number;
  /** Load script only after user interaction (scroll, click, etc.) */
  loadOnInteraction?: boolean;
}

/**
 * Wraps a callback with requestIdleCallback for non-critical scripts
 * Falls back to setTimeout for browsers without requestIdleCallback support
 */
function scheduleIdleCallback(callback: () => void, timeout = 2000): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, {timeout});
  } else {
    setTimeout(callback, 50);
  }
}

/**
 * Waits for user interaction before executing callback
 * Triggers on scroll, click, touch, or keydown
 */
function waitForInteraction(callback: () => void): () => void {
  const events = ['scroll', 'click', 'touchstart', 'keydown'];
  let triggered = false;

  const handler = () => {
    if (triggered) return;
    triggered = true;
    events.forEach((event) =>
      document.removeEventListener(event, handler, {capture: true}),
    );
    callback();
  };

  events.forEach((event) =>
    document.addEventListener(event, handler, {capture: true, passive: true}),
  );

  // Return cleanup function
  return () => {
    events.forEach((event) =>
      document.removeEventListener(event, handler, {capture: true}),
    );
  };
}

export function loadScript(
  attributes: Partial<HTMLScriptElement> & {id: string} & Record<
    `data-${string}`,
    any
  >,
  placement?: 'head' | 'body' | RefObject<HTMLElement | null> | null,
  deferOptions?: DeferOptions,
): Promise<boolean> {
  const {id, innerHTML, src, type, onload, onerror, ...rest} = {
    ...attributes,
  };
  const additionalAttributes = {...rest} as Record<string, any>;
  const scriptId = id || src || innerHTML || '';
  const isScriptLoaded = SCRIPTS_LOADED[scriptId];

  if (isScriptLoaded) {
    return isScriptLoaded;
  }

  const createAndAppendScript = (
    resolve: (value: boolean) => void,
    reject: (reason?: any) => void,
  ) => {
    const script = document.createElement('script');
    script.type = type || 'text/javascript';
    if (id) script.id = id;
    if (src) script.src = src;
    if (innerHTML) script.innerHTML = innerHTML;
    const additionalAttributesKeys = Object.keys({...additionalAttributes});
    if (additionalAttributesKeys.length) {
      additionalAttributesKeys.forEach((key) => {
        script.setAttribute(key, additionalAttributes[key]);
      });
    }

    // For inline scripts (innerHTML without src), resolve immediately after appending
    // since they execute synchronously and don't fire onload
    if (innerHTML && !src) {
      script.onerror = (e): void => {
        reject(false);
        if (typeof onerror === 'function') {
          onerror(e);
        }
      };

      // checks if placement is react ref
      if (
        placement !== null &&
        typeof placement === 'object' &&
        'current' in placement
      ) {
        placement?.current?.appendChild(script);
      } else if (placement === 'head') {
        document.head.appendChild(script);
      } else {
        document.body.appendChild(script);
      }

      // Resolve immediately for inline scripts
      // Use setTimeout to ensure script is in DOM and executed
      setTimeout(() => resolve(true), 0);
      return;
    }

    // For external scripts (with src), use onload/onerror
    script.onload = (e): void => {
      resolve(true);
      if (typeof onload === 'function') {
        onload(e);
      }
    };
    script.onerror = (e): void => {
      reject(false);
      if (typeof onerror === 'function') {
        onerror(e);
      }
    };

    // checks if placement is react ref
    if (
      placement !== null &&
      typeof placement === 'object' &&
      'current' in placement
    ) {
      placement?.current?.appendChild(script);
    } else if (placement === 'head') {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  };

  const promise = new Promise<boolean>((resolve, reject) => {
    const executeLoad = () => createAndAppendScript(resolve, reject);

    // Handle deferred loading options
    if (deferOptions?.loadOnInteraction) {
      waitForInteraction(executeLoad);
    } else if (deferOptions?.useIdleCallback) {
      scheduleIdleCallback(executeLoad, deferOptions.delay || 2000);
    } else if (deferOptions?.delay) {
      setTimeout(executeLoad, deferOptions.delay);
    } else {
      executeLoad();
    }
  });

  SCRIPTS_LOADED[scriptId] = promise;

  return promise;
}

type ScriptState = 'loading' | 'done' | 'error';
type LoadScriptParams = Parameters<typeof loadScript>;

/**
 * The `useLoadScript` hook loads an external script tag in the browser.
 * It allows React components to lazy-load large third-party dependencies.
 * @param attributes - any valid HTMLScriptElement attributes
 * @param placement - placement of the script tag in the document either in the head or body
 * @param ready - boolean to determine if the script should be loaded
 * @param deferOptions - options for deferred loading (useIdleCallback, delay, loadOnInteraction)
 * @returns status of script loading
 * @example
 * ```tsx
 * useLoadScript(
 *  {
 *    id: 'google-script',
 *    innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':...`,
 *  },
 *  'head',
 *  !!ENV.PUBLIC_GOOGLE_ID, // only load script if var is defined
 * );
 * // or with deferred loading
 * const status = useLoadScript(
 *   {src: 'https://scripts.xyz.com/v1/shopify.js'},
 *   'body',
 *   true,
 *   {useIdleCallback: true} // Load during browser idle time
 * );
 * // or load on user interaction
 * const status = useLoadScript(
 *   {src: 'https://chat-widget.com/widget.js'},
 *   'body',
 *   true,
 *   {loadOnInteraction: true} // Load after scroll, click, etc.
 * );
 * ```
 */

export function useLoadScript(
  attributes: LoadScriptParams[0], // any valid HTMLScriptElement attributes; id is required
  placement: LoadScriptParams[1] = 'body', // 'head' | 'body' | RefObject<HTMLElement | null> | null
  ready = true, // boolean to determine if the script should be loaded
  deferOptions?: DeferOptions, // options for deferred loading
): ScriptState {
  const [status, setStatus] = useState<ScriptState>('loading');
  const stringifiedAttributes = JSON.stringify(attributes);
  const stringifiedDeferOptions = JSON.stringify(deferOptions);

  useEffect(() => {
    if (!ready) return;

    async function loadScriptWrapper(): Promise<void> {
      try {
        setStatus('loading');
        await loadScript(attributes, placement, deferOptions);
        setStatus('done');
      } catch (error) {
        setStatus('error');
      }
    }

    loadScriptWrapper().catch(() => {
      setStatus('error');
    });
  }, [placement, ready, stringifiedAttributes, stringifiedDeferOptions]);

  return status;
}
