import {
  redirect,
  type ActionFunction,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';

export async function loader({params}: LoaderFunctionArgs) {
  const locale = params.locale;
  return redirect(locale ? `/${locale}` : '/');
}

export const action: ActionFunction = async ({context}: ActionFunctionArgs) => {
  return context.customerAccount.logout();
};
