import {useCallback, useEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';

import {useDataLayerClickEvents, useLocale} from '~/hooks';
import type {SubscribeToBackInStockReturn} from '~/lib/klaviyo';

/**
 * Submit email to back in stock subscription
 * @returns {Object} - handleSubmit, isSubmitting, message, success, submittedAt
 * @example
 * ```tsx
 * const {handleSubmit, isSubmitting, message, success, submittedAt} = useBackInStock();
 * ```
 */

interface SubmitProps {
  email: string;
  variantId: string;
}

interface UseBackInStockReturn {
  handleSubmit: ({email, variantId}: SubmitProps) => void;
  isSubmitting: boolean;
  message: string;
  submittedAt: string | undefined;
  success: boolean;
}

export function useBackInStock(): UseBackInStockReturn {
  const {sendSubscribeEvent} = useDataLayerClickEvents();
  const fetcher = useFetcher<SubscribeToBackInStockReturn>();
  const {pathPrefix} = useLocale();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {status, message = '', error, email, submittedAt} = fetcher.data || {};

  const handleSubmit = useCallback(
    async ({email, variantId}: SubmitProps) => {
      if (!email || !variantId || isSubmitting) return;
      setIsSubmitting(true);
      fetcher.submit(
        {
          action: 'subscribeToBackInStock',
          email,
          variantId,
        },
        {method: 'POST', action: `${pathPrefix}/api/klaviyo`},
      );
    },
    [isSubmitting],
  );

  useEffect(() => {
    if (submittedAt) {
      setIsSubmitting(false);
    }
    if (status === 200) {
      sendSubscribeEvent({email});
    }
  }, [submittedAt]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (error) {
      console.error('useBackInStock:error', error);
    }
  }, [error]);

  return {
    handleSubmit,
    isSubmitting,
    message,
    submittedAt,
    success: status === 200,
  };
}
