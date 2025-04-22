import {useLocation, useParams} from '@remix-run/react';
import clsx from 'clsx';

import {LoadingDots} from '~/components/Animations';
import {useCustomerRegister} from '~/lib/customer';
import type {Settings} from '~/lib/types';

export function RegisterForm({settings}: {settings: Settings['account']}) {
  const {pathname} = useLocation();
  const {customerRegister, errors, status} = useCustomerRegister();
  const {locale: pathPrefix = ''} = useParams();

  const {
    heading,
    pageHeading,
    submitText = 'Create Account',
  } = {...settings?.register};

  return (
    <div className="rounded border border-border px-3 py-6 md:px-6 md:py-10">
      {pathname.startsWith(`${pathPrefix}/account/register`) && !pageHeading ? (
        <h1 className="text-h3 mb-6 text-center">{heading}</h1>
      ) : (
        <h2 className="text-h3 mb-6 text-center">{heading}</h2>
      )}

      <form
        className="mx-auto flex w-full max-w-[25rem] flex-col gap-4"
        id="customer-create-form"
        onSubmit={customerRegister}
      >
        <label htmlFor="register-firstName">
          <span className="input-label">First Name</span>
          <input
            className="input-text"
            id="register-firstName"
            name="firstName"
            placeholder="First Name"
            required
            type="text"
          />
        </label>

        <label htmlFor="register-lastName">
          <span className="input-label">Last Name</span>
          <input
            className="input-text"
            id="register-lastName"
            name="lastName"
            placeholder="Last Name"
            required
            type="text"
          />
        </label>

        <label htmlFor="register-email">
          <span className="input-label">Email</span>
          <input
            className="input-text"
            id="register-email"
            name="email"
            placeholder="email@email.com"
            required
            type="email"
          />
        </label>

        <label htmlFor="register-password">
          <span className="input-label">Password</span>
          <input
            className="input-text"
            id="register-password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        <label htmlFor="register-passwordConfirm">
          <span className="input-label">Confirm Password</span>
          <input
            className="input-text"
            id="register-passwordConfirm"
            name="passwordConfirm"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        <button
          aria-label="Create Account"
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
              status="Registering"
              withAbsolutePosition
              withStatusRole
            />
          )}
        </button>
      </form>

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

RegisterForm.displayName = 'RegisterForm';
