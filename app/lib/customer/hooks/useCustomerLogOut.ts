import {useCallback} from 'react';
import {useFetcher} from '@remix-run/react';

export function useCustomerLogOut() {
  const fetcher = useFetcher({key: 'logout'});

  const customerLogOut = useCallback(() => {
    fetcher.submit(null, {method: 'POST', action: '/account/logout'});
  }, []);

  return {customerLogOut};
}
