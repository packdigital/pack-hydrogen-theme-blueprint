import {DEFAULT_LOCALE} from '~/lib/constants';
import type {I18nLocale} from '~/lib/types';
import {useGlobal} from '~/hooks';

/**
 * Get selected locale of buyer
 * @returns Locale
 */

export function useLocale(): I18nLocale {
  const {selectedLocale} = useGlobal();
  return selectedLocale || DEFAULT_LOCALE;
}
