import {useMemo} from 'react';

import {useSettingsContext} from '~/contexts/SettingsProvider/useSettingsContext';
import type {SettingsContext} from '~/lib/types';

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
