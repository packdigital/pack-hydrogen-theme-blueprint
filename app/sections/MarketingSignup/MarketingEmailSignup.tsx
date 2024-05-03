import {useEffect} from 'react';

import {LoadingDots} from '~/components';
import {useMarketingListSubscribe} from '~/hooks';

import type {MarketingEmailSignupProps} from './MarketingSignup.types';

export function MarketingEmailSignup({
  listId,
  heading,
  subtext,
  placeholder,
  buttonText = 'Sign Up',
  thankYouText,
  onSuccess,
}: MarketingEmailSignupProps) {
  const {formRef, handleSubmit, message, isSubmitting, submitted} =
    useMarketingListSubscribe({listId});

  useEffect(() => {
    if (submitted && typeof onSuccess === 'function') onSuccess();
  }, [submitted]);

  return (
    <form
      className=" mx-auto w-full max-w-[38rem] text-center"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {heading && <h3 className="text-h4 text-current">{heading}</h3>}

      {subtext && <p className="mt-2 text-base">{subtext}</p>}

      <input
        className="input-text mt-6 text-text"
        name="email"
        placeholder={placeholder}
        required
        type="email"
      />

      <button
        aria-label={buttonText}
        className="btn-primary mt-3 w-full"
        disabled={!listId}
        type="submit"
      >
        {!isSubmitting && buttonText}

        {isSubmitting && (
          <span aria-label="Subscribing" aria-live="assertive" role="status">
            <LoadingDots />
          </span>
        )}
      </button>

      <div className="pointer-events-none mt-6 min-h-6">
        {message && (
          <p className="pointer-events-auto text-base">
            {submitted ? thankYouText : message}
          </p>
        )}
      </div>
    </form>
  );
}

MarketingEmailSignup.displayName = 'MarketingEmailSignup';
