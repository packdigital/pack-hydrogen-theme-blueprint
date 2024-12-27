import {useMemo} from 'react';
import {useSiteSettings} from '@pack/react';

import {useSettingsContext} from '~/contexts/SettingsProvider/useSettingsContext';
import type {Settings} from '~/lib/types';

/**
 * Hook for getting settings from Pack's useSiteSettings hook, with a fallback to settings set in the global context provider to be used within error boundaries
 * @returns settings from site settings
 *  * @example
 * ```js
 * const settings = useSettings();
 * // or destructure
 * const {header} = useSettings();
 * ```
 */

export function useSettings(): Settings {
  const siteSettings = useSiteSettings();
  const {state} = useSettingsContext();
  return useMemo(() => {
    return {...(siteSettings?.settings || state.settings)};
  }, [siteSettings?.settings, state.settings]);
}
