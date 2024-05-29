import {useCallback} from 'react';
import {useFetcher, useNavigate} from '@remix-run/react';

import {LOGGED_OUT_REDIRECT_TO} from '~/lib/constants';
import {removeCustomerAccessTokenFromLocalStorage} from '~/lib/customer';
import {useGlobal, useLocale} from '~/hooks';

export function useCustomerLogOut() {
  const {isPreviewModeEnabled, setPreviewModeCustomer} = useGlobal();
  const {pathPrefix} = useLocale();
  const navigate = useNavigate();
  const fetcher = useFetcher({key: 'logout'});

  const customerLogOut = useCallback(() => {
    /* when in customizer, customer is managed through local storage and
     * global state, instead of session cookies */
    if (isPreviewModeEnabled) {
      setPreviewModeCustomer(null);
      removeCustomerAccessTokenFromLocalStorage();
      return navigate(`${pathPrefix}${LOGGED_OUT_REDIRECT_TO}`);
    }

    fetcher.submit(null, {method: 'POST', action: '/account/logout'});
  }, []);

  return {customerLogOut};
}
