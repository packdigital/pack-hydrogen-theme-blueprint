import {useEffect} from 'react';
import {useNavigate} from '@remix-run/react';

import {LOGGED_IN_REDIRECT_TO} from '~/lib/constants';
import {useCustomer, useGlobal, useLocale} from '~/hooks';

export function GuestAccountLayout({children}: {children: React.ReactNode}) {
  const {isPreviewModeEnabled} = useGlobal();
  const customer = useCustomer();
  const navigate = useNavigate();
  const {pathPrefix} = useLocale();

  const customerPending =
    !!isPreviewModeEnabled && typeof customer === 'undefined';

  useEffect(() => {
    if (customerPending) return;
    if (isPreviewModeEnabled && customer) {
      navigate(`${pathPrefix}${LOGGED_IN_REDIRECT_TO}`);
    }
  }, [customerPending]);

  return (
    <section
      className="px-contained py-contained"
      data-comp={GuestAccountLayout.displayName}
    >
      {children}
    </section>
  );
}

GuestAccountLayout.displayName = 'AccountLayout.Guest';
