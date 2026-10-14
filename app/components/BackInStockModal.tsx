import {useEffect, useId, useState} from 'react';
import {parseGid} from '@shopify/hydrogen';
import clsx from 'clsx';

import {LoadingDots} from '~/components/Animations';
import {
  useAnnounce,
  useBackInStock,
  useCustomer,
  useMenu,
  useSettings,
} from '~/hooks';
import type {SelectedVariant} from '~/lib/types';

interface BackInStockModalProps {
  selectedVariant: SelectedVariant;
}

export function BackInStockModal({selectedVariant}: BackInStockModalProps) {
  const customer = useCustomer();
  const {product: productSettings} = useSettings();
  const {closeModal} = useMenu();
  const {
    handleSubmit,
    isSubmitting,
    message: apiMessage,
    submittedAt,
    success,
  } = useBackInStock();

  const [email, setEmail] = useState(
    customer?.emailAddress?.emailAddress || '',
  );
  const [message, setMessage] = useState('');
  const emailId = useId();
  const messageId = useId();
  const announce = useAnnounce();
  const {heading, subtext, submitText, successText} = {
    ...productSettings?.backInStock,
  };

  useEffect(() => {
    if (!submittedAt) return;
    if (success) {
      setEmail('');
      const successMessage = successText || apiMessage || 'Thank you!';
      setMessage(successMessage);
      // The modal auto-closes, so announce globally rather than in the modal
      announce(successMessage);
      setTimeout(() => {
        setMessage('');
        closeModal();
      }, 2500);
    } else {
      setMessage(apiMessage || 'Something went wrong. Please try again later.');
    }
  }, [submittedAt]);

  const {id: variantId} = parseGid(selectedVariant?.id);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div>
        <h2 className="text-h3">{heading}</h2>
        {subtext && <p className="mt-2">{subtext}</p>}
      </div>

      <div>
        <h3 className="text-h4">{selectedVariant?.product.title}</h3>
        <p>{selectedVariant?.title}</p>
      </div>

      <form
        className="flex w-full flex-col items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit({email, variantId});
        }}
      >
        <label className="sr-only" htmlFor={emailId}>
          Email address
        </label>
        <input
          aria-describedby={message ? messageId : undefined}
          autoComplete="email"
          className="input-text text-text md:max-w-screen-xs"
          id={emailId}
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          required
          type="email"
          value={email}
        />

        <button className="btn-primary mt-3 max-md:w-full" type="submit">
          <span className={clsx(isSubmitting ? 'invisible' : 'visible')}>
            {submitText}
          </span>

          {isSubmitting && (
            <LoadingDots
              status="Subscribing"
              withAbsolutePosition
              withStatusRole
            />
          )}
        </button>
      </form>

      {/* Always mounted so the result is announced (WCAG 4.1.3) */}
      <div aria-live="polite" id={messageId} role="status">
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

BackInStockModal.displayName = 'BackInStockModal';
