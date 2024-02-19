import {useEffect} from 'react';

import {useCustomerCreateAddress} from '~/lib/customer';

import {AddressForm} from './AddressForm';

interface CreateAddressFormProps {
  setIsCreateAddress: (isCreateAddress: boolean) => void;
}

export function CreateAddressForm({
  setIsCreateAddress,
}: CreateAddressFormProps) {
  const {address, createAddress, errors, status} = useCustomerCreateAddress();

  useEffect(() => {
    if (address && status.success) {
      setIsCreateAddress(false);
    }
  }, [address, status.success]);

  const buttonText = 'Add Address';

  return (
    <AddressForm
      buttonText={buttonText}
      closeForm={() => setIsCreateAddress(false)}
      errors={errors}
      onSubmit={createAddress}
      status={status}
      title="Add a New Address"
    />
  );
}

CreateAddressForm.displayname = 'CreateAddressForm';
