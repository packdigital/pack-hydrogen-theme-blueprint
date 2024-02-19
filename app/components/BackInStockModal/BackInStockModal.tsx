import {useCallback, useState} from 'react';
import {useSiteSettings} from '@pack/react';

import type {SelectedVariant, SiteSettings} from '~/lib/types';
import {useCustomer, useDataLayerClickEvents, useGlobal} from '~/hooks';

interface BackInStockModalProps {
  selectedVariant: SelectedVariant;
}

export function BackInStockModal({selectedVariant}: BackInStockModalProps) {
  const customer = useCustomer();
  const {sendSubscribeEvent} = useDataLayerClickEvents();
  const siteSettings = useSiteSettings() as SiteSettings;
  const {closeModal} = useGlobal();

  const [email, setEmail] = useState(customer?.email || '');
  const {heading, subtext, submitText} = {
    ...siteSettings?.settings?.product?.backInStock,
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const email = e.currentTarget.email.value;

      // back in stock integration here

      sendSubscribeEvent({email});
      closeModal();
    },
    [],
  );

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div>
        <h2 className="text-title-h3">{heading}</h2>
        {subtext && <p className="mt-2">{subtext}</p>}
      </div>

      <div>
        <h3 className="text-title-h4">{selectedVariant?.product.title}</h3>
        <p>{selectedVariant?.title}</p>
      </div>

      <form
        className="flex w-full flex-col items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="input-text text-text md:max-w-[30rem]"
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
    </div>
  );
}

BackInStockModal.displayName = 'BackInStockModal';
