import {DEFAULT_LOCALE} from '~/lib/constants';
import type {I18nLocale} from '~/lib/types';
import {useRootLoaderData} from '~/hooks';

/**
 * Get selected locale of buyer
 * @returns Locale
 */

export function useLocale(): I18nLocale {
  const rootData = useRootLoaderData();
  return (rootData?.selectedLocale ?? DEFAULT_LOCALE) as I18nLocale;
}
