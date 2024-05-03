import {useCallback, useState} from 'react';

import type {SelectedVariant} from '~/lib/types';
import {
  useCustomer,
  useDataLayerClickEvents,
  useGlobal,
  useSettings,
} from '~/hooks';

interface BackInStockModalProps {
  selectedVariant: SelectedVariant;
}

export function BackInStockModal({selectedVariant}: BackInStockModalProps) {
  const customer = useCustomer();
  const {sendSubscribeEvent} = useDataLayerClickEvents();
  const {product} = useSettings();
  const {closeModal} = useGlobal();

  const [email, setEmail] = useState(customer?.email || '');
  const [message, setMessage] = useState('');
  const {heading, subtext, submitText, successText} = {...product?.backInStock};

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const email = e.currentTarget.email.value;

      // back in stock integration here

      sendSubscribeEvent({email});
      setEmail('');
      setMessage(successText || 'Thank you!');
      setTimeout(() => {
        setMessage('');
        closeModal();
      }, 2500);
    },
    [],
  );

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
        onSubmit={handleSubmit}
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
          {submitText}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

BackInStockModal.displayName = 'BackInStockModal';
