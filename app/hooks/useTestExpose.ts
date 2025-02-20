import { useEffect, useState, useRef } from 'react';
import { useAnalytics } from '@shopify/hydrogen';

import { AnalyticsEvent } from '~/components/Analytics/constants';
import { useRootLoaderData } from './useRootLoaderData';

const AB_TEST_COOKIE_GROUP = 'C0003'; // Functional

export function useTestExpose() {
  const { ENV } = useRootLoaderData();
  const [hasUserConsent, setHasUserConsent] = useState<boolean>(false);
  const { publish } = useAnalytics();

  const publishRef = useRef(publish);

  useEffect(() => {
    publishRef.current = publish;
  }, [publish]);

  const handleTestExpose = (test: any) => {
    if (hasUserConsent) {
      console.log('==== TEST EXPOSED ====', test);

      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: 'view_experiment',
        experiment_name: test.handle,
        experiment_variation: test.testVariant.handle,
      });

      setTimeout(() => {
        publishRef.current?.(AnalyticsEvent.EXPERIMENT_EXPOSED, test);
      }, 1000);
    }
  };

  if (ENV?.PUBLIC_ONETRUST_DATA_DOMAIN_SCRIPT) {
    useEffect(() => {
      const checkConsent = (event: any) => {
        setHasUserConsent(
          [...(event.detail || [])].includes(AB_TEST_COOKIE_GROUP),
        );
      };
      window.addEventListener('OneTrustGroupsUpdated', checkConsent);
      return () => {
        window.removeEventListener('OneTrustGroupsUpdated', checkConsent);
      };
    }, []);
  }

  // https://shopify.dev/docs/api/customer-privacy#use-an-event-listener
  useEffect(() => {
    const handleConsentChange = (event: any) => {
      const hasAnalyticsAllowed = event?.detail?.analyticsAllowed || false;

      setHasUserConsent(hasAnalyticsAllowed);
      // console.log("Consent collected:", event.detail); // Log the event details if needed
    };

    // Add event listener for 'visitorConsentCollected'
    document.addEventListener('visitorConsentCollected', handleConsentChange);

    return () => {
      // Clean up the event listener on unmount
      document.removeEventListener(
        'visitorConsentCollected',
        handleConsentChange,
      );
    };
  }, []);

  useEffect(() => {
    console.log('hasUserConsent', hasUserConsent);
  }, [hasUserConsent]);

  return { handleTestExpose, hasUserConsent };
}