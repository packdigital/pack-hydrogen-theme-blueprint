import {useLocation, useParams} from '@remix-run/react';

import {LoadingDots} from '~/components';
import type {Settings} from '~/lib/types';
import {useCustomerRegister} from '~/lib/customer';

export function RegisterForm({settings}: {settings: Settings['account']}) {
  const {pathname} = useLocation();
  const {customerRegister, errors, status} = useCustomerRegister();
  const {locale: pathPrefix = ''} = useParams();

  const {heading, pageHeading} = {...settings?.register};

  const buttonText = 'Create Account';

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
        <label htmlFor="firstName">
          <span className="input-label">First Name</span>
          <input
            className="input-text"
            name="firstName"
            placeholder="First Name"
            required
            type="text"
          />
        </label>

        <label htmlFor="lastName">
          <span className="input-label">Last Name</span>
          <input
            className="input-text"
            name="lastName"
            placeholder="Last Name"
            required
            type="text"
          />
        </label>

        <label htmlFor="email">
          <span className="input-label">Email</span>
          <input
            className="input-text"
            name="email"
            placeholder="email@email.com"
            required
            type="email"
          />
        </label>

        <label htmlFor="password">
          <span className="input-label">Password</span>
          <input
            className="input-text"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        <label htmlFor="passwordConfirm">
          <span className="input-label">Confirm Password</span>
          <input
            className="input-text"
            name="passwordConfirm"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        <button
          aria-label="Create Account"
          className={`btn-primary mt-3 w-full min-w-40 self-center md:w-auto  ${
            status.started ? 'cursor-default' : ''
          }`}
          type="submit"
        >
          <span className={`${status.started ? 'invisible' : 'visible'}`}>
            {buttonText}
          </span>

          {status.started && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingDots />
            </span>
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
