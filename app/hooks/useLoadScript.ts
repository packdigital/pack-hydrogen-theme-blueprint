import {useState, useEffect} from 'react';

const SCRIPTS_LOADED: Record<string, Promise<boolean>> = {};

export function loadScript(
  attributes: Partial<HTMLScriptElement> & {id: string} & Record<
      `data-${string}`,
      any
    >,
  placement?: 'head' | 'body' | null,
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

  const promise = new Promise<boolean>((resolve, reject) => {
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
    if (placement === 'head') {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  });

  SCRIPTS_LOADED[scriptId] = promise;

  return promise;
}

type ScriptState = 'loading' | 'done' | 'error';
type LoadScriptParams = Parameters<typeof loadScript>;

/**
 * The `useLoadScript` hook loads an external script tag in the browser. It allows React components to lazy-load large third-party dependencies.
 * @param attributes - any valid HTMLScriptElement attributes
 * @param placement - placement of the script tag in the document either in the head or body
 * @param ready - boolean to determine if the script should be loaded
 * @returns status of script loading
 * @example
 * ```tsx
 * useLoadScript(
 *  {
 *    id: 'google-script',
 *    innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':...`,
 *  },
 *  'head',
 *  !!ENV?.PUBLIC_GOOGLE_ID, // only load script if var is defined
 * );
 * // or
 * const status = useLoadScript({
 *   src: 'https://scripts.xyz.com/v1/shopify.js',
 * });
 * ```
 */

export function useLoadScript(
  attributes: LoadScriptParams[0], // any valid HTMLScriptElement attributes; id is required
  placement: LoadScriptParams[1] = 'body', // 'head' | 'body'
  ready = true, // boolean to determine if the script should be loaded
): ScriptState {
  const [status, setStatus] = useState<ScriptState>('loading');
  const stringifiedAttributes = JSON.stringify(attributes);

  useEffect(() => {
    if (!ready) return;

    async function loadScriptWrapper(): Promise<void> {
      try {
        setStatus('loading');
        await loadScript(attributes, placement);
        setStatus('done');
      } catch (error) {
        setStatus('error');
      }
    }

    loadScriptWrapper().catch(() => {
      setStatus('error');
    });
  }, [placement, ready, stringifiedAttributes]);

  return status;
}
