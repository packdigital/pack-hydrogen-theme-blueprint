import type {GlobalContext} from '~/lib/types';
import {useGlobalContext} from '~/contexts';

/**
 * Hook for Global Provider, e.g. cartOpen, searchOpen, etc.
 * @returns Global context
 */

export function useGlobal(): GlobalContext['state'] & GlobalContext['actions'] {
  const {state, actions} = useGlobalContext() as GlobalContext;
  return {
    ...state,
    ...actions,
  };
}
