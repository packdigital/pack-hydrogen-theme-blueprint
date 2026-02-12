import {useCallback} from 'react';
import {useFetcher} from 'react-router';

import {deleteCookie} from '~/lib/utils';

export function useCustomerLogOut() {
  const fetcher = useFetcher({key: 'logout'});

  const customerLogOut = useCallback(() => {
    fetcher.submit(null, {method: 'POST', action: '/account/logout'});
    deleteCookie('og_auth');
  }, []);

  return {customerLogOut};
}
