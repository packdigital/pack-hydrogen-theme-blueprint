import {useMemo} from 'react';

import type {MenuContext} from '~/lib/types';
import {useMenuContext} from '~/contexts';

/**
 * Hook for Menu Provider, e.g. e.g. cartOpen, searchOpen, etc.
 * @returns Menu context
 */

export function useMenu(): MenuContext['state'] & MenuContext['actions'] {
  const {state, actions} = useMenuContext();
  return useMemo(() => {
    return {
      ...state,
      ...actions,
    };
  }, [state, actions]);
}
