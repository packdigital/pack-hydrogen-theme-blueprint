import {redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunction,
  AppLoadContext,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@shopify/remix-oxygen';

import {LOGGED_OUT_REDIRECT_TO} from '~/lib/constants';
import type {I18nLocale} from '~/lib/types';

export async function customerLogout(context: AppLoadContext) {
  const {session} = context;
  session.unset('customerAccessToken');

  // The only file to explicitly type cast i18n to pass typecheck
  return redirect(
    `${
      (context.storefront.i18n as I18nLocale).pathPrefix
    }${LOGGED_OUT_REDIRECT_TO}`,
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  return customerLogout(context);
}

export const action: ActionFunction = async ({context}: ActionFunctionArgs) => {
  return customerLogout(context);
};
