import {useCallback} from 'react';
import {useFetcher, useNavigate} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';

import {LOGGED_OUT_REDIRECT_TO} from '~/lib/constants';
import {removeCustomerAccessTokenFromLocalStorage} from '~/lib/customer';
import {useLocale, usePreviewMode} from '~/hooks';

export function useCustomerLogOut() {
  const {isPreviewModeEnabled, setPreviewModeCustomer} = usePreviewMode();
  const {buyerIdentityUpdate} = useCart();
  const {pathPrefix} = useLocale();
  const navigate = useNavigate();
  const fetcher = useFetcher({key: 'logout'});

  const customerLogOut = useCallback(() => {
    buyerIdentityUpdate({customerAccessToken: null});

    /* when in customizer, customer is managed through local storage and
     * global state, instead of session cookies */
    if (isPreviewModeEnabled) {
      setPreviewModeCustomer(null);
      removeCustomerAccessTokenFromLocalStorage();
      return navigate(`${pathPrefix}${LOGGED_OUT_REDIRECT_TO}`);
    }

    fetcher.submit(null, {
      method: 'POST',
      action: `${pathPrefix}/account/logout`,
    });
  }, [buyerIdentityUpdate]);

  return {customerLogOut};
}
