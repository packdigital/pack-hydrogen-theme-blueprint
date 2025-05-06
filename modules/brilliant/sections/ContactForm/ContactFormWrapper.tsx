'use client';

import {Suspense} from 'react';

import FormContactForm from './FormContactForm.client';

import {Spinner} from '~/components/Animations';
import {Card, CardContent} from '~/components/ui/card';

export function ContactFormWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FormContactForm />
    </Suspense>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex size-full items-center justify-center pt-12">
      <Card className="p-8">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Spinner width="200" color="#1e40af" />
            <h3 className="mt-4">Loading our Contact Form</h3>
            <h5>This will just take a second!</h5>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
