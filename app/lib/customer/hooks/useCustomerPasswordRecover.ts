import {useCallback} from 'react';
import {useFetcher} from '@remix-run/react';

import {useLocale} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  recoverPasswordEmailSent?: boolean;
}

export function useCustomerPasswordRecover() {
  const fetcher = useFetcher({key: 'recover-password'});
  const {pathPrefix} = useLocale();

  const {status} = useFetcherStatus({state: fetcher.state});

  const recoverPassword = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status.started) return;
      const formData = new FormData(e.currentTarget);
      formData.append('action', 'recover-password');
      fetcher.submit(formData, {
        method: 'POST',
        action: `${pathPrefix}/account/login`,
      });
    },
    [status.started],
  );

  return {
    recoverPasswordEmailSent:
      (fetcher.data as FetcherData)?.recoverPasswordEmailSent || false,
    recoverPassword,
    status,
  };
}
