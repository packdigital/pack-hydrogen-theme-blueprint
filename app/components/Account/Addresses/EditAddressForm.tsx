import {useEffect} from 'react';

import {useCustomerUpdateAddress} from '~/hooks';

import {AddressForm} from './AddressForm';
import type {EditAddressFormProps} from './Addresses.types';

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
