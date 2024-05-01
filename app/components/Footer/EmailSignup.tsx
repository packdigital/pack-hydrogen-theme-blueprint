import {LoadingDots} from '~/components';
import type {Settings} from '~/lib/types';
import {useMarketingListSubscribe} from '~/hooks';

/*
 * Env PRIVATE_KLAVIYO_API_KEY must be set locally and through the Hydrogen app
 * Key should have full access to lists
 */

export function EmailSignup({settings}: {settings: Settings['footer']}) {
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
      className="border-b border-b-gray px-4 py-8 md:border-none md:p-0"
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
        {!isSubmitting && buttonText}

        {isSubmitting && (
          <span aria-label="Subscribing" aria-live="assertive" role="status">
            <LoadingDots />
          </span>
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
}

EmailSignup.displayName = 'EmailSignup';
