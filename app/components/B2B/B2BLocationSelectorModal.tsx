import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {useMenu, useLocale} from '~/hooks';
import type {
  CustomerCompanyLocation,
  CustomerCompanyLocationConnection,
} from '~/lib/types';

import {useB2BLocationContext} from './useB2BLocationContext';

interface FetcherData {
  success: boolean;
  error: string | null;
}

export function B2BLocationSelectorModal() {
  const fetcher = useFetcher();
  const {company, companyLocationId} = useB2BLocationContext();
  const {closeModal} = useMenu();
  const {pathPrefix} = useLocale();

  const {success, error} = {...(fetcher.data as FetcherData)};

  useEffect(() => {
    if (success) {
      // timeout is hack to address edge case where modal
      // doesn't close on success on first selection
      setTimeout(() => closeModal(), 100);
    }
  }, [success]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!error) return;
    console.error('b2bLocationSelector:error', error);
  }, [error]);

  const locations = company?.locations?.edges
    ? company.locations.edges.map(
        (location: CustomerCompanyLocationConnection) => {
          return {...location.node};
        },
      )
    : [];

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <h2 className="text-h3">Logged in for {company?.name}</h2>

      <fieldset>
        <legend className="mb-5">Choose a company location:</legend>
        <div
          className={`grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-10 ${
            locations.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'
          }`}
        >
          {locations.map((location: CustomerCompanyLocation) => {
            const addressLines =
              location?.shippingAddress?.formattedAddress ?? [];
            const isSelected = location.id === companyLocationId;
            return (
              <label key={location.id}>
                <button
                  aria-label={`Select ${location.name}`}
                  onClick={() => {
                    fetcher.submit(
                      {companyLocationId: location.id},
                      {
                        method: 'POST',
                        action: `${pathPrefix}/api/b2blocations`,
                      },
                    );
                  }}
                  className={`rounded border p-5 transition md:hover:border-black ${
                    isSelected ? 'border-black' : 'border-border'
                  }`}
                  type="button"
                >
                  <div className="text-sm sm:text-base">
                    <p className="text-sm font-bold sm:text-base">
                      {location.name}
                    </p>
                    {addressLines.map((line: string) => (
                      <p key={line} className="text-sm sm:text-base">
                        {line}
                      </p>
                    ))}
                  </div>
                </button>
                <span className="sr-only">{location.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
