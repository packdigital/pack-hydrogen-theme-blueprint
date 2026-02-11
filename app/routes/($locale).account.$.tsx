import {redirect} from 'react-router';

import type {Route} from './+types/($locale).account.$';

export async function loader({context, params}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();
  const locale = params.locale;
  return redirect(locale ? `/${locale}/account` : '/account');
}
