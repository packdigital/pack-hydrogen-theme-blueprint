import {useCallback} from 'react';

import type {Settings} from '~/lib/types';
import {useDataLayerClickEvents} from '~/hooks';

export function EmailSignup({settings}: {settings: Settings['footer']}) {
  const {sendSubscribeEvent} = useDataLayerClickEvents();
  const {enabled, heading, subtext, placeholder, buttonText} = {
    ...settings?.marketing,
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const email = e.currentTarget.email.value;

      // email marketing integration here

      sendSubscribeEvent({email});
    },
    [],
  );

  return enabled ? (
    <form
      className="border-b border-b-gray px-4 py-8 md:border-none md:p-0"
      onSubmit={handleSubmit}
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
        {buttonText}
      </button>
    </form>
  ) : null;
}

EmailSignup.displayName = 'EmailSignup';
