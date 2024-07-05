import {useCallback, useEffect, useRef, useState} from 'react';
import {useFetcher} from '@remix-run/react';

import {useDataLayerClickEvents, useLocale} from '~/hooks';
import type {SubscribeEmailOrPhoneToListReturn} from '~/lib/klaviyo';

/**
 * Submit email or phone number to marketing list
 * @param listId - list id to subscribe to
 * @param reset - boolean to reset message after submission
 * @param resetTimer - time in ms to reset message after submission
 * @returns {Object} - handleSubmit, message, isSubmitting, submitted
 * @example
 * ```tsx
 * const {formRef, handleSubmit, message, isSubmitting, submitted} = useMarketingListSubscribe({listId: 'S6Qqx9'});
 * ```
 */

interface UseMarketingListSubscribeReturn {
  formRef: React.RefObject<HTMLFormElement>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  isSubmitting: boolean;
  submitted: boolean;
}

export function useMarketingListSubscribe({
  listId,
  reset = true,
  resetTimer = 2500,
}: {
  listId: string;
  reset?: boolean;
  resetTimer?: number;
}): UseMarketingListSubscribeReturn {
  const formRef = useRef<HTMLFormElement>(null);
  const {sendSubscribeEvent} = useDataLayerClickEvents();
  const fetcher = useFetcher<SubscribeEmailOrPhoneToListReturn>();
  const {pathPrefix} = useLocale();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const email = e.currentTarget.email?.value;
      const phone =
        e.currentTarget.phone?.value ||
        e.currentTarget.phoneNumber?.value ||
        e.currentTarget.phone_number?.value;
      const smsConsent =
        e.currentTarget.smsConsent?.value ||
        e.currentTarget.sms_consent?.value ||
        false;

      if ((!email && !phone) || isSubmitting || !listId) return;
      setIsSubmitting(true);
      setMessage('');
      setSubmitted(false);

      fetcher.submit(
        {
          action: 'subscribeEmailOrPhoneToList',
          listId,
          ...(email ? {email} : null),
          ...(phone ? {phone, smsConsent} : null),
        },
        {method: 'POST', action: `${pathPrefix}/api/klaviyo`},
      );
    },
    [isSubmitting, listId],
  );

  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data.status === 200) {
      formRef.current?.reset();
      setIsSubmitting(false);
      setMessage(fetcher.data.message);
      if (!fetcher.data.isAlreadySubscribed) setSubmitted(true);
      if (reset) {
        setTimeout(() => {
          setMessage('');
          setSubmitted(false);
        }, resetTimer);
      }
      if (fetcher.data.email) sendSubscribeEvent({email: fetcher.data.email});
      if (fetcher.data.phone) sendSubscribeEvent({phone: fetcher.data.phone});
    } else {
      setIsSubmitting(false);
      setMessage(fetcher.data.message);
      if (reset) setTimeout(() => setMessage(''), resetTimer);
      console.error(fetcher.data.error);
    }
  }, [fetcher.data?.submittedAt]);

  return {
    formRef,
    handleSubmit,
    message,
    isSubmitting,
    submitted,
  };
}
