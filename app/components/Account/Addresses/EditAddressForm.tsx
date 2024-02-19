import {useEffect} from 'react';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import {useCustomerUpdateAddress} from '~/lib/customer';

import {AddressForm} from './AddressForm';

interface EditAddressFormProps {
  defaultAddress: MailingAddress | null;
  initialAddress: MailingAddress | null;
  setInitialAddress: (initialAddress: MailingAddress | null) => void;
}

export function EditAddressForm({
  defaultAddress,
  initialAddress,
  setInitialAddress,
}: EditAddressFormProps) {
  const {address, errors, status, updateAddress} = useCustomerUpdateAddress();

  useEffect(() => {
    if (address && status.success) {
      setInitialAddress(null);
    }
  }, [address, status.success]);

  const buttonText = 'Update Address';

  return (
    <AddressForm
      buttonText={buttonText}
      closeForm={() => setInitialAddress(null)}
      defaultAddress={defaultAddress}
      errors={errors}
      onSubmit={updateAddress}
      initialAddress={initialAddress}
      status={status}
      title="Edit Address"
    />
  );
}

EditAddressForm.displayname = 'EditAddressForm';
