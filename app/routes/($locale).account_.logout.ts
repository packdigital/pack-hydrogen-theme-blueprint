import {redirect} from 'react-router';

import type {Route} from './+types/($locale).account_.logout';

export async function loader({params}: Route.LoaderArgs) {
  const locale = params.locale;
  return redirect(locale ? `/${locale}` : '/');
}

export const action = async ({context}: Route.ActionArgs) => {
  return context.customerAccount.logout();
};
