import {useEffect, useState} from 'react';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import {useCustomerDeleteAddress} from '~/lib/customer';

interface AddressesItemProps {
  address: MailingAddress;
  defaultAddress: MailingAddress | null;
  initialAddress: MailingAddress | null;
  setInitialAddress: (address: MailingAddress | null) => void;
  setIsCreateAddress: (isCreateAddress: boolean) => void;
}

export function AddressesItem({
  address,
  defaultAddress,
  initialAddress,
  setInitialAddress,
  setIsCreateAddress,
}: AddressesItemProps) {
  const {deleteAddress, deletedCustomerAddressId, errors} =
    useCustomerDeleteAddress();

  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  useEffect(() => {
    if (deletedCustomerAddressId) {
      setIsDeleteConfirm(false);
      if (deletedCustomerAddressId === initialAddress?.id)
        setInitialAddress(null);
    }
  }, [deletedCustomerAddressId]);

  useEffect(() => {
    if (errors.length) {
      errors.forEach((error) => {
        console.error(error);
      });
    }
  }, [errors]);

  const {
    address1,
    address2,
    city,
    company,
    country,
    id,
    name,
    phone,
    province,
    zip,
  } = address;
  const isDefaultAddress =
    defaultAddress?.id?.split('?')[0] === id.split('?')[0];

  return (
    <div className="relative flex h-full flex-col justify-between gap-x-4 gap-y-6 rounded border border-border p-6 xs:flex-row md:flex-col lg:flex-row">
      <div>
        <h3 className="text-h5 mb-2">{name}</h3>

        <div className="flex flex-col gap-1.5 text-sm">
          {company && <p>{company}</p>}
          <p>{address1}</p>
          {address2 && <p>{address2}</p>}
          <p>{`${city}, ${province} ${zip}`}</p>
          <p>{country}</p>
          {phone && <p>{phone}</p>}
        </div>
      </div>

      <div className="flex justify-between gap-6 xs:flex-col md:flex-row lg:flex-col">
        <div className="flex gap-6">
          <button
            aria-label="Edit address"
            className="text-nav text-main-underline font-normal"
            onClick={() => {
              setInitialAddress(address);
              setIsCreateAddress(false);
              window.scrollTo({top: 0, behavior: 'smooth'});
            }}
            type="button"
          >
            Edit
          </button>

          <button
            aria-label="Delete address"
            className="text-nav text-main-underline font-normal text-red-500"
            onClick={() => setIsDeleteConfirm(true)}
            type="button"
          >
            Delete
          </button>
        </div>

        {isDefaultAddress && (
          <p className="text-nav text-right text-gray">Default</p>
        )}
      </div>

      {isDeleteConfirm && (
        <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-4 bg-[rgba(255,255,255,0.9)] p-4">
          <p className="text-center text-sm">
            Are you sure you want to delete this address?
          </p>

          <div className="flex gap-6">
            <button
              aria-label="Delete address"
              className="text-nav text-main-underline font-normal"
              onClick={() => deleteAddress({id})}
              type="button"
            >
              Delete
            </button>

            <button
              aria-label="Cancel"
              className="text-nav text-main-underline font-normal"
              onClick={() => setIsDeleteConfirm(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

AddressesItem.displayName = 'AddressesItem';
