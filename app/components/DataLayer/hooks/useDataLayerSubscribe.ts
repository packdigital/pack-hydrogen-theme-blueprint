import {useCallback, useEffect, useState} from 'react';

import {useGlobal} from '~/hooks';

export function useDataLayerSubscribe({
  handleDataLayerEvent,
  userDataEventTriggered,
}: {
  handleDataLayerEvent: (event: Record<string, any>) => void;
  userDataEventTriggered: boolean;
}) {
  const {emitter} = useGlobal();

  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedPhone, setSubscribedPhone] = useState('');

  const subscribeEmailEvent = useCallback(({email}: {email: string}) => {
    if (!email) return;
    const event = {
      event: 'dl_subscribe',
      lead_type: 'email',
      user_properties: {customer_email: email},
    };
    handleDataLayerEvent(event);
  }, []);

  const subscribePhoneEvent = useCallback(({phone}: {phone: string}) => {
    if (!phone) return;
    const event = {
      event: 'dl_subscribe',
      lead_type: 'phone',
      user_properties: {customer_phone: phone},
    };
    handleDataLayerEvent(event);
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
