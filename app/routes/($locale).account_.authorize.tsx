import {redirect} from 'react-router';

import {FROM_ACCOUNT_AUTHORIZATION_KEY} from '~/lib/constants';

import type {Route} from './+types/($locale).account_.authorize';

export async function loader({context, params}: Route.LoaderArgs) {
  await context.customerAccount.authorize();
  const locale = params.locale;
  return redirect(
    locale
      ? `/${locale}/account?${FROM_ACCOUNT_AUTHORIZATION_KEY}=1`
      : `/account?${FROM_ACCOUNT_AUTHORIZATION_KEY}=1`,
  );
}
