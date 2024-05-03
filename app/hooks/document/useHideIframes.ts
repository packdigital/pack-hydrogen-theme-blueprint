import {useCallback} from 'react';

import {useGlobal} from '~/hooks';

export function useHideIframes() {
  const {toggleIframesHidden} = useGlobal();

  const hideIframes = useCallback(() => {
    toggleIframesHidden(true);
  }, [toggleIframesHidden]);

  const resetIframes = useCallback(() => {
    toggleIframesHidden(false);
  }, [toggleIframesHidden]);

  return {hideIframes, resetIframes};
}
