import {Fragment} from 'react';

import {Link, LoadingDots} from '~/components';
import {useMarketingListSubscribe} from '~/hooks';

import type {MarketingPhoneSignupProps} from './MarketingSignup.types';

export function MarketingPhoneSignup({
  listId,
  heading,
  subtext,
  placeholder,
  buttonText = 'Sign Up',
  thankYouText,
  smsConsentText,
  smsConsentLinks,
}: MarketingPhoneSignupProps) {
  const {formRef, handleSubmit, message, isSubmitting, submitted} =
    useMarketingListSubscribe({listId});

  return (
    <form
      className=" mx-auto w-full max-w-[38rem]"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {heading && (
        <h3 className="text-h4 text-center text-current">{heading}</h3>
      )}

      {subtext && <p className="mt-2 text-center text-base">{subtext}</p>}

      <input
        className="input-text mt-6 text-text"
        name="phone"
        placeholder={placeholder}
        required
        type="tel"
      />

      <div className="mt-3 flex gap-2 align-top">
        <div>
          <input
            id="smsConsent"
            name="smsConsent"
            required
            type="checkbox"
            value="yes"
            className="cursor-pointer"
          />
          <input type="hidden" name="smsConsent" value="no" />
        </div>

        <label className="pt-0.5 text-xs" htmlFor="smsConsent">
          {smsConsentText}
          {smsConsentLinks?.map(({link}, index) => {
            return (
              <Fragment key={index}>
                {` `}
                <Link
                  className="underline"
                  to={link?.url}
                  newTab={link?.newTab}
                  type={link?.type}
                >
                  {link?.text}
                </Link>
                {` `}
              </Fragment>
            );
          })}
        </label>
      </div>

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

MarketingPhoneSignup.displayName = 'MarketingPhoneSignup';
