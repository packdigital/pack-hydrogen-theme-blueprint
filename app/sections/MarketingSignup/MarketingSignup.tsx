import {useEffect, useState} from 'react';

import {Container} from '~/components';

import {MarketingEmailSignup} from './MarketingEmailSignup';
import {MarketingPhoneSignup} from './MarketingPhoneSignup';
import {Schema} from './MarketingSignup.schema';
import type {MarketingSignupCms} from './MarketingSignup.types';

/*
 * Env PRIVATE_KLAVIYO_API_KEY must be set locally and through the Hydrogen app
 * Key should have full access to lists
 */

export function MarketingSignup({cms}: {cms: MarketingSignupCms}) {
  const {type = 'email', heading, email, phone} = cms;

  const [step, setStep] = useState(type === 'emailPhone' ? 'email' : type);

  useEffect(() => {
    setStep(type === 'emailPhone' ? 'email' : type);
  }, [type]);

  return (
    <Container container={cms.container}>
      <div className="px-contained py-contained flex flex-col gap-6">
        <h2 className="text-h2 text-center text-current">{heading}</h2>

        {(type === 'email' || type === 'emailPhone') && (
          <div
            className={`flex flex-col ${step === 'email' ? 'block' : 'hidden'}`}
          >
            <MarketingEmailSignup
              {...email}
              onSuccess={() => {
                if (type !== 'emailPhone') return;
                setTimeout(() => setStep('phone'), 2500);
              }}
            />

            {type === 'emailPhone' && (
              <button
                className="mt-3 self-center text-center underline"
                type="button"
                onClick={() => setStep('phone')}
              >
                Go to {phone?.heading || 'SMS'} {`>`}
              </button>
            )}
          </div>
        )}

        {(type === 'phone' || type === 'emailPhone') && (
          <div
            className={`flex flex-col ${step === 'phone' ? 'block' : 'hidden'}`}
          >
            <MarketingPhoneSignup {...phone} />

            {type === 'emailPhone' && (
              <button
                className="mt-3 self-center text-center underline"
                type="button"
                onClick={() => setStep('email')}
              >
                {`<`} Go back to {email?.heading || 'Email'}
              </button>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}

MarketingSignup.displayName = 'MarketingSignup';
MarketingSignup.Schema = Schema;
