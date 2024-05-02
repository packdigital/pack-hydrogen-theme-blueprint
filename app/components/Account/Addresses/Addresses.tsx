import {useMemo, useState} from 'react';
import {useLocation} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import {Pagination} from '~/components';
import {useCustomer, usePagination, useSettings} from '~/hooks';

import {AddressesItem} from './AddressesItem';
import {CreateAddressForm} from './CreateAddressForm';
import {EditAddressForm} from './EditAddressForm';

const RESULTS_PER_PAGE = 10;

export function Addresses() {
  const {pathname} = useLocation();
  const {account} = useSettings();
  const customer = useCustomer();
  const defaultAddress = customer?.defaultAddress as MailingAddress | null;

  const addresses: MailingAddress[] = useMemo(() => {
    if (customer?.addresses) {
      return flattenConnection(customer.addresses);
    }
    return [];
  }, [customer]);

  const defaultAddressId = defaultAddress?.id?.split('?')[0];
  const addressesWithDefaultFirst = addresses?.reduce(
    (acc: MailingAddress[], address) => {
      const isDefault = address.id?.split('?')[0] === defaultAddressId;
      return isDefault ? [address, ...acc] : [...acc, address];
    },
    [],
  );

  const {currentPage, endIndex, setCurrentPage, startIndex} = usePagination({
    resultsPerPage: RESULTS_PER_PAGE,
    totalResults: addressesWithDefaultFirst?.length,
  });

  const [initialAddress, setInitialAddress] = useState<MailingAddress | null>(
    null,
  );
  const [isCreateAddress, setIsCreateAddress] = useState(false);

  const {menuItems} = {...account?.menu};
  const heading = menuItems?.find(({link}) => pathname.startsWith(link?.url))
    ?.link?.text;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col items-start justify-start gap-4 md:flex-row md:justify-between">
        <h1 className="text-h4">{heading}</h1>

        <button
          aria-label="Add a new address"
          className="text-main-underline text-nav bg-[linear-gradient(var(--primary),var(--primary))] font-normal"
          onClick={() => {
            setIsCreateAddress(true);
            setInitialAddress(null);
          }}
          type="button"
        >
          + Add A New Address
        </button>
      </div>

      {initialAddress && !isCreateAddress && (
        <EditAddressForm
          defaultAddress={defaultAddress}
          initialAddress={initialAddress}
          setInitialAddress={setInitialAddress}
        />
      )}

      {isCreateAddress && !initialAddress && (
        <CreateAddressForm setIsCreateAddress={setIsCreateAddress} />
      )}

      {!addressesWithDefaultFirst?.length && (
        <div
          role="status"
          className="relative flex min-h-48 items-center justify-center"
        >
          You don&#39;t have any addresses saved yet
        </div>
      )}

      {!!addressesWithDefaultFirst?.length && (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {addressesWithDefaultFirst
            .slice(startIndex, endIndex)
            .map((address) => {
              return (
                <li key={address.id}>
                  <AddressesItem
                    address={address}
                    defaultAddress={defaultAddress}
                    initialAddress={initialAddress}
                    setIsCreateAddress={setIsCreateAddress}
                    setInitialAddress={setInitialAddress}
                  />
                </li>
              );
            })}
        </ul>
      )}

      {addressesWithDefaultFirst?.length > RESULTS_PER_PAGE && (
        <div className="mt-8 self-center md:mt-10">
          <Pagination
            currentPage={currentPage}
            pageNeighbors={1}
            resultsPerPage={RESULTS_PER_PAGE}
            setCurrentPage={setCurrentPage}
            totalResults={addressesWithDefaultFirst.length}
            withScrollToTop={true}
          />
        </div>
      )}
    </div>
  );
}

Addresses.displayName = 'Addresses';
