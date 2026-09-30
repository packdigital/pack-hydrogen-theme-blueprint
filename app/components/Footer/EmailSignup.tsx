import {memo, useId} from 'react';
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
    const emailId = useId();
    const messageId = useId();

    return enabled ? (
      <form
        className="border-b border-b-neutralLight px-4 py-8 md:border-none md:p-0"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <h2 className="text-nav text-current">{heading}</h2>

        {subtext && (
          <p className="mt-2 text-base text-current md:text-sm">{subtext}</p>
        )}

        <label className="sr-only" htmlFor={emailId}>
          Email address
        </label>
        <input
          aria-describedby={message ? messageId : undefined}
          autoComplete="email"
          className="input-text mt-6 text-text"
          id={emailId}
          name="email"
          placeholder={placeholder}
          required
          type="email"
        />

        <button className="btn-primary mt-3 w-full" type="submit">
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

        {/* Always mounted so the result is announced (WCAG 4.1.3) */}
        <div
          aria-live="polite"
          className="pointer-events-none mt-3 min-h-5"
          id={messageId}
          role="status"
        >
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
