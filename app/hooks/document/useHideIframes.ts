import {useCallback} from 'react';

import {useMenu} from '~/hooks';

export function useHideIframes() {
  const {toggleIframesHidden} = useMenu();

  const hideIframes = useCallback(() => {
    toggleIframesHidden(true);
  }, [toggleIframesHidden]);

  const resetIframes = useCallback(() => {
    toggleIframesHidden(false);
  }, [toggleIframesHidden]);

  return {hideIframes, resetIframes};
}
