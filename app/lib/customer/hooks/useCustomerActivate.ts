import {useCallback, useEffect, useMemo} from 'react';
import {useFetcher, useLocation} from '@remix-run/react';

import {useRootLoaderData} from '~/hooks';

import {useFetcherStatus} from './useFetcherStatus';

interface FetcherData {
  errors: string[];
  formErrors: string[];
}

export function useCustomerActivate() {
  const fetcher = useFetcher({key: 'activate'});
  const {url} = useRootLoaderData();
  const location = useLocation();

  const {errors: apiErrors, formErrors} = {...(fetcher.data as FetcherData)};
  const {errors, setErrors, status} = useFetcherStatus({
    fetcherErrors: formErrors,
    state: fetcher.state,
  });

  const {customerId, activationToken} = useMemo(() => {
    let pathname = '';
    try {
      pathname = new URL(url)?.pathname;
    } catch (error) {
      pathname = `${location.pathname}${location.search}`;
    }
    const [, , , customerId, activationToken] = pathname.split('/');
    return {customerId, activationToken};
  }, [url]);

  const activateAccount = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status.started) return;
      setErrors([]);
      const {password, passwordConfirm} = e.currentTarget;
      if (password.value !== passwordConfirm.value) {
        setErrors(['Passwords do not match. Please try again.']);
        return;
      }
      const formData = new FormData(e.currentTarget);
      formData.append('activationToken', activationToken);
      formData.append('customerId', customerId);
      formData.append('action', 'activate');
      fetcher.submit(formData, {method: 'POST'});
    },
    [activationToken, customerId, status.started],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!apiErrors?.length) return;
    apiErrors.forEach((error) => {
      return console.error('customerActivate:error', error);
    });
  }, [apiErrors]);

  return {
    errors,
    activateAccount,
    status,
  };
}
