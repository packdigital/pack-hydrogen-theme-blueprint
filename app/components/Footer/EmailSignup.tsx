import {memo} from 'react';
import clsx from 'clsx';

import {LoadingDots} from '~/components/Animations';
import {useMarketingListSubscribe} from '~/hooks';
import type {Settings} from '~/lib/types';

/*
 * Env PRIVATE_KLAVIYO_API_KEY must be set locally and through the Hydrogen app
 * Key should have full access to lists
 */

export const EmailSignup = memo(
  ({settings}: {settings: Settings['footer']}) => {
    const {
      enabled,
      listId,
      heading,
      subtext,
      placeholder,
      buttonText,
      thankYouText,
    } = {
      ...settings?.marketing,
    };

    const {formRef, handleSubmit, message, isSubmitting, submitted} =
      useMarketingListSubscribe({listId});

    return enabled ? (
      <form
        className="border-b border-b-neutralLight px-4 py-8 md:border-none md:p-0"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <h3 className="text-nav text-current">{heading}</h3>

        {subtext && (
          <p className="mt-2 text-base text-current md:text-sm">{subtext}</p>
        )}

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
          type="submit"
        >
          <span className={clsx(isSubmitting ? 'invisible' : 'visible')}>
            {buttonText}
          </span>

          {isSubmitting && (
            <LoadingDots
              status="Subscribing"
              withAbsolutePosition
              withStatusRole
            />
          )}
        </button>

        <div className="pointer-events-none mt-3 min-h-5">
          {message && (
            <p className="pointer-events-auto text-sm">
              {submitted ? thankYouText : message}
            </p>
          )}
        </div>
      </form>
    ) : null;
  },
);

EmailSignup.displayName = 'EmailSignup';
