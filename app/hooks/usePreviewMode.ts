import {useMemo} from 'react';

import type {SettingsContext} from '~/lib/types';
import {useSettingsContext} from '~/contexts';

/**
 * Hook for PreviewMode context from SettingsProvider
 * @returns PreviewMode context
 */

export function usePreviewMode(): Pick<
  SettingsContext['state'],
  'isPreviewModeEnabled' | 'previewModeCustomer'
> &
  Pick<SettingsContext['actions'], 'setPreviewModeCustomer'> {
  const {state, actions} = useSettingsContext();
  return useMemo(() => {
    return {
      isPreviewModeEnabled: state.isPreviewModeEnabled,
      previewModeCustomer: state.previewModeCustomer,
      setPreviewModeCustomer: actions.setPreviewModeCustomer,
    };
  }, [state, actions]);
}
