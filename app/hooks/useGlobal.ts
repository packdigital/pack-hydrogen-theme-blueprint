import {useMemo} from 'react';

import {useGlobalContext} from '~/contexts/GlobalProvider/useGlobalContext';
import type {GlobalContext} from '~/lib/types';

/**
 * Hook for Global Provider, e.g. isCartReady
 * @returns Global context
 */

export function useGlobal(): GlobalContext['state'] & GlobalContext['actions'] {
  const {state, actions} = useGlobalContext();
  return useMemo(() => {
    return {
      ...state,
      ...actions,
    };
  }, [state, actions]);
}
