import {useEffect, useState} from 'react';
import {parseGid} from '@shopify/hydrogen';

import {LoadingDots} from '~/components';
import {useBackInStock, useCustomer, useGlobal, useSettings} from '~/hooks';
import type {SelectedVariant} from '~/lib/types';

interface BackInStockModalProps {
  selectedVariant: SelectedVariant;
}

export function BackInStockModal({selectedVariant}: BackInStockModalProps) {
  const customer = useCustomer();
  const {product: productSettings} = useSettings();
  const {closeModal} = useGlobal();
  const {
    handleSubmit,
    isSubmitting,
    message: apiMessage,
    submittedAt,
    success,
  } = useBackInStock();

  const [email, setEmail] = useState(customer?.email || '');
  const [message, setMessage] = useState('');
  const {heading, subtext, submitText, successText} = {
    ...productSettings?.backInStock,
  };

  useEffect(() => {
    if (!submittedAt) return;
    if (success) {
      setEmail('');
      setMessage(successText || apiMessage || 'Thank you!');
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
        <input
          className="input-text text-text md:max-w-screen-xs"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          required
          type="email"
          value={email}
        />

        <button
          aria-label="Notify Me"
          className="btn-primary mt-3 max-md:w-full"
          type="submit"
        >
          {!isSubmitting && submitText}

          {isSubmitting && (
            <span aria-label="Subscribing" aria-live="assertive" role="status">
              <LoadingDots />
            </span>
          )}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

BackInStockModal.displayName = 'BackInStockModal';
