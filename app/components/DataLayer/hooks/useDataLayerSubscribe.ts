import {useCallback, useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import {useGlobal} from '~/hooks';

export function useDataLayerSubscribe({
  DEBUG,
  userDataEventTriggered,
}: {
  DEBUG?: boolean;
  userDataEventTriggered: boolean;
}) {
  const {emitter} = useGlobal();

  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedPhone, setSubscribedPhone] = useState('');

  const subscribeEmailEvent = useCallback(({email}: {email: string}) => {
    if (!email) return;
    const event = {
      event: 'subscribe',
      event_id: uuidv4(),
      event_time: new Date().toISOString(),
      lead_type: 'email',
      user_properties: {customer_email: email},
    };

    if (window.gtag) window.gtag('event', event.event, event);
    if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
  }, []);

  const subscribePhoneEvent = useCallback(({phone}: {phone: string}) => {
    if (!phone) return;
    const event = {
      event: 'subscribe',
      event_id: uuidv4(),
      event_time: new Date().toISOString(),
      lead_type: 'phone',
      user_properties: {customer_phone: phone},
    };

    if (window.gtag) window.gtag('event', event.event, event);
    if (DEBUG) console.log(`DataLayer:gtag:${event.event}`, event);
  }, []);

  // Subscribe to EventEmitter topic for 'subscribe' event
  useEffect(() => {
    emitter?.on('SUBSCRIBE_EMAIL', (email: string) => {
      setSubscribedEmail(email);
    });
    emitter?.on('SUBSCRIBE_PHONE', (phone: string) => {
      setSubscribedPhone(phone);
    });
    return () => {
      emitter?.off('SUBSCRIBE_EMAIL', (email: string) => {
        setSubscribedEmail(email);
      });
      emitter?.off('SUBSCRIBE_PHONE', (phone: string) => {
        setSubscribedPhone(phone);
      });
    };
  }, []);

  // Trigger 'subscribe' event after email submission
  useEffect(() => {
    if (!subscribedEmail || !userDataEventTriggered) return;
    subscribeEmailEvent({email: subscribedEmail});
  }, [subscribedEmail, userDataEventTriggered]);

  // Trigger 'subscribe' event after phone submission
  useEffect(() => {
    if (!subscribedPhone || !userDataEventTriggered) return;
    subscribePhoneEvent({phone: subscribedPhone});
  }, [subscribedPhone, userDataEventTriggered]);
}
