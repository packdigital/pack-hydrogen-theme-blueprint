import type {CustomerAddress} from '@shopify/hydrogen/customer-account-api-types';

import type {Status} from '~/lib/types';

export interface AddressesItemProps {
  address: CustomerAddress;
  defaultAddress: CustomerAddress | null;
  initialAddress: CustomerAddress | null;
  setInitialAddress: (address: CustomerAddress | null) => void;
  setIsCreateAddress: (isCreateAddress: boolean) => void;
}

interface InitialAddressElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  company: HTMLInputElement;
  address1: HTMLInputElement;
  address2: HTMLInputElement;
  city: HTMLInputElement;
  zip: HTMLInputElement;
  phoneNumber: HTMLInputElement;
}

export interface InitialAddressForm extends HTMLFormElement {
  elements: InitialAddressElements;
}

export interface AddressFormProps {
  buttonText: string;
  closeForm: () => void;
  defaultAddress?: CustomerAddress | null;
  errors: string[];
  initialAddress?: CustomerAddress | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: Status;
  title: string;
}

export interface CreateAddressFormProps {
  setIsCreateAddress: (isCreateAddress: boolean) => void;
}

export interface EditAddressFormProps {
  defaultAddress: CustomerAddress | null;
  initialAddress: CustomerAddress | null;
  setInitialAddress: (initialAddress: CustomerAddress | null) => void;
}

export interface ProvinceType {
  name: string;
  shortCode: string;
}
