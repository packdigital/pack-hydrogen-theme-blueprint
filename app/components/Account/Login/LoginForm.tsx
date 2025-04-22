import {useLocation, useParams} from '@remix-run/react';
import clsx from 'clsx';

import {LoadingDots} from '~/components/Animations';
import {useCustomerLogIn} from '~/lib/customer';
import type {Settings} from '~/lib/types';

interface LoginFormProps {
  setIsForgotPassword: (isForgotPassword: boolean) => void;
  settings: Settings['account'];
}

export function LoginForm({setIsForgotPassword, settings}: LoginFormProps) {
  const {pathname} = useLocation();
  const {customerLogIn, errors, status} = useCustomerLogIn();
  const {locale: pathPrefix = ''} = useParams();

  const {
    forgotText,
    heading,
    pageHeading,
    submitText = 'Log In',
  } = {
    ...settings?.login,
  };

  return (
    <div className="flex flex-col items-center rounded border border-border px-3 py-6 md:px-6 md:py-10">
      {pathname.startsWith(`${pathPrefix}/account/login`) && !pageHeading ? (
        <h1 className="text-h3 mb-6 text-center">{heading}</h1>
      ) : (
        <h2 className="text-h3 mb-6 text-center">{heading}</h2>
      )}

      <form
        className="mx-auto flex w-full max-w-[25rem] flex-col gap-4"
        id="customer-login-form"
        onSubmit={customerLogIn}
      >
        <label htmlFor="login-email">
          <span className="input-label">Email</span>
          <input
            className="input-text"
            id="login-email"
            name="email"
            placeholder="email@email.com"
            required
            type="email"
          />
        </label>

        <label htmlFor="login-password">
          <span className="input-label">Password</span>
          <input
            className="input-text"
            id="login-password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        <button
          aria-label="Log in to your account"
          className={clsx(
            'btn-primary mt-3 w-full min-w-40 self-center md:w-auto',
            status.started && 'cursor-default',
          )}
          type="submit"
        >
          <span className={clsx(status.started ? 'invisible' : 'visible')}>
            {submitText}
          </span>

          {status.started && (
            <LoadingDots
              status="Logging in"
              withAbsolutePosition
              withStatusRole
            />
          )}
        </button>
      </form>

      <button
        aria-label={forgotText}
        className="text-underline mt-4 text-center text-sm font-bold"
        onClick={() => setIsForgotPassword(true)}
        type="button"
      >
        {forgotText}
      </button>

      {errors?.length > 0 && (
        <ul className="mt-4 flex flex-col items-center gap-1">
          {errors.map((error, index) => {
            return (
              <li key={index} className="text-center text-sm text-red-500">
                {error}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

LoginForm.displayName = 'LoginForm';
