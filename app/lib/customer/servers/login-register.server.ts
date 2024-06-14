import type {ActionFunctionArgs, AppLoadContext} from '@shopify/remix-oxygen';
import type {
  Customer,
  CustomerAccessToken,
} from '@shopify/hydrogen/storefront-api-types';

import {
  customerCreateClient,
  customerLoginClient,
  passwordRecoverClient,
} from '~/lib/customer';
import {getSiteSettings} from '~/lib/utils';

const ACTIONS = ['login', 'register', 'recover-password'];

const getLoginFormError = (
  error: string | unknown,
  context: AppLoadContext,
) => {
  if (context.storefront.isApiError(error)) {
    return 'Something went wrong. Please try again later.';
  } else {
    return 'Sorry. We did not recognize either your email or password. Please try to sign in again or create a new account.';
  }
};

const getRegisterFormError = (
  error: string | unknown,
  context: AppLoadContext,
) => {
  if (context.storefront.isApiError(error)) {
    return 'Something went wrong. Please try again later.';
  } else {
    return 'Sorry. We could not create an account with this email. User might already exist, try to login instead.';
  }
};

interface Data {
  customerAccessToken: CustomerAccessToken | null;
  customer: Customer | null;
  errors: string[] | null;
  loginFormErrors: string[] | null;
  registerFormErrors: string[] | null;
  recoverPasswordEmailSent?: boolean | null;
}

export const customerLoginRegisterAction = async ({
  request,
  context,
}: {
  request: ActionFunctionArgs['request'];
  context: ActionFunctionArgs['context'];
}): Promise<{
  data: Data;
  status: number;
}> => {
  const data: Data = {
    customerAccessToken: null,
    customer: null,
    errors: null,
    loginFormErrors: null,
    registerFormErrors: null,
  };
  let action = null;
  try {
    let body;
    try {
      body = await request.formData();
    } catch (error) {}
    action = String(body?.get('action') || '');

    if (!action) {
      data.errors = ['Missing action'];
      return {data, status: 500};
    }
    if (!ACTIONS.includes(action)) {
      data.errors = ['Invalid action'];
      return {data, status: 500};
    }

    /* --- LOGIN --- */
    if (action === 'login') {
      const siteSettings = await getSiteSettings(context);
      const unidentifiedCustomerText =
        siteSettings?.data?.siteSettings?.settings?.account?.login
          ?.unidentifiedCustomerText;

      const email = String(body?.get('email') || '');
      const password = String(body?.get('password') || '');

      if (!email || !password) {
        data.loginFormErrors = ['Missing email or password.'];
        return {data, status: 400};
      }

      const {errors: loginFormErrors, response: loginResponse} =
        await customerLoginClient(context, {email, password});

      if (loginFormErrors?.length) {
        console.error('customerLoginClient:errors', loginFormErrors);
        data.errors = loginFormErrors;
        data.loginFormErrors = loginFormErrors.map((error) =>
          error === 'Unidentified customer'
            ? unidentifiedCustomerText || error
            : error,
        );
        return {data, status: 400};
      }
      const {customerAccessToken, customer} = {...loginResponse};
      if (customer && customerAccessToken) {
        console.log('customerLoginClient:customer', customer);
        console.log(
          'customerLoginClient:customerAccessToken',
          customerAccessToken,
        );
        data.customer = customer;
        data.customerAccessToken = customerAccessToken;
        return {data, status: 200};
      }
    }

    /* --- REGISTER --- */
    if (action === 'register') {
      const firstName = String(body?.get('firstName') || '');
      const lastName = String(body?.get('lastName') || '');
      const email = String(body?.get('email') || '');
      const password = String(body?.get('password') || '');
      const passwordConfirm = String(body?.get('passwordConfirm') || '');
      const acceptsMarketing = Boolean(body?.get('acceptsMarketing'));

      if (password !== passwordConfirm) {
        data.registerFormErrors = ['Passwords do not match.'];
        return {data, status: 400};
      }

      if (!email || !password) {
        data.registerFormErrors = ['Missing email or password.'];
        return {data, status: 400};
      }

      if (!firstName || !lastName) {
        data.registerFormErrors = ['Missing first name or last name.'];
        return {data, status: 400};
      }

      const {errors: createErrors, response: createResponse} =
        await customerCreateClient(context, {
          acceptsMarketing: acceptsMarketing || false,
          firstName,
          lastName,
          email,
          password,
        });

      if (createErrors?.length) {
        console.error('customerCreateClient:errors', createErrors);
        data.errors = createErrors;
        data.registerFormErrors = createErrors;
        return {data, status: 400};
      }
      const {customerAccessToken, customer} = {...createResponse};
      if (customer && customerAccessToken) {
        console.log('customerCreateClient:customer', customer);
        console.log(
          'customerCreateClient:customerAccessToken',
          customerAccessToken,
        );
        data.customer = customer;
        data.customerAccessToken = customerAccessToken;
        return {data, status: 200};
      }
    }

    // /* --- PASSWORD RECOVER --- */
    if (action === 'recover-password') {
      const email = String(body?.get('email') || '');

      const {errors: recoverErrors, response: recoverResponse} =
        await passwordRecoverClient(context, {email});

      if (recoverResponse?.emailSent) {
        console.log('passwordRecoverClient:emailSent', true);
        data.recoverPasswordEmailSent = true;
      } else {
        console.log('passwordRecoverClient:emailSent', false);
        data.recoverPasswordEmailSent = false;
      }
      if (recoverErrors?.length) {
        console.error('passwordRecoverClient:errors', recoverErrors);
        data.errors = recoverErrors;
        return {data, status: 400};
      }
    }

    return {data, status: 200};
  } catch (error) {
    console.error(`customerLoginRegisterAction:error ${error}`);
    if (!action) {
      data.errors = [error as string];
    }
    if (action === 'login') {
      data.loginFormErrors = [getLoginFormError(error, context)];
    } else if (action === 'register') {
      data.registerFormErrors = [getRegisterFormError(error, context)];
    }
    return {data, status: 500};
  }
};
