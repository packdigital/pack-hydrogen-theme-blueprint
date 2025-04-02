import {useGlobalContext} from '~/contexts/GlobalProvider/useGlobalContext';
import type {GlobalState} from '~/lib/types';

/**
 * Hook for detecting if the browser user is a bot
 * @returns boolean if bot or not
 *  * @example
 * ```js
 * const isBot = useIsBot();
 * ```
 */

export function useIsBot(): GlobalState['isBot'] {
  const {state} = useGlobalContext();
  return state.isBot;
}
