import {useEffect, useState} from 'react';

import {LoadingDots} from '~/components';
import type {Settings} from '~/lib/types';
import {useCustomerPasswordRecover} from '~/lib/customer';

interface ForgotPasswordFormProps {
  setIsForgotPassword: (isForgotPassword: boolean) => void;
  settings: Settings['account'];
}

export function ForgotPasswordForm({
  setIsForgotPassword,
  settings,
}: ForgotPasswordFormProps) {
  const {recoverPassword, status} = useCustomerPasswordRecover();
  const [message, setMessage] = useState('');

  const {heading, postSubmissionText, subtext} = {
    ...settings?.forgot,
  };

  const buttonText = 'Submit';

  useEffect(() => {
    if (status.finished) {
      setMessage(postSubmissionText);
      setTimeout(() => {
        setMessage('');
        setIsForgotPassword(false);
      }, 3000);
    }
  }, [status.finished]);

  return (
    <div className="flex flex-col items-center rounded border border-border px-3 py-6 md:px-6 md:py-10">
      <div className="mb-6 flex flex-col gap-4">
        <h2 className="text-h3 text-center">{heading}</h2>

        {subtext && <p className="max-w-xs text-center text-sm">{subtext}</p>}
      </div>

      <form
        className="mx-auto flex w-full max-w-[25rem] flex-col gap-4"
        onSubmit={recoverPassword}
      >
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

        <button
          aria-label="Submit email for password recovery"
          className={`btn-primary mt-3 min-w-40 self-center ${
            status.started ? 'cursor-default' : ''
          }`}
          type="submit"
        >
          {status.started ? <LoadingDots /> : buttonText}
        </button>
      </form>

      <button
        aria-label="Cancel"
        className="text-underline mt-4 text-center text-sm font-bold"
        onClick={() => setIsForgotPassword(false)}
        type="button"
      >
        Cancel
      </button>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}

ForgotPasswordForm.displayName = 'ForgotPasswordForm';
