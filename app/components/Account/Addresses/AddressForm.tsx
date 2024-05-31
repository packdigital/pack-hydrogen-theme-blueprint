import {useEffect, useMemo, useRef, useState} from 'react';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import {LoadingDots, Select} from '~/components';
import type {Status} from '~/lib/types';
import {useCountriesList} from '~/hooks';

interface InitialAddressElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  company: HTMLInputElement;
  address1: HTMLInputElement;
  address2: HTMLInputElement;
  city: HTMLInputElement;
  zip: HTMLInputElement;
  phone: HTMLInputElement;
}

interface InitialAddressForm extends HTMLFormElement {
  elements: InitialAddressElements;
}

interface AddressFormProps {
  buttonText: string;
  closeForm: () => void;
  defaultAddress?: MailingAddress | null;
  errors: string[];
  initialAddress?: MailingAddress | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: Status;
  title: string;
}

export function AddressForm({
  buttonText,
  closeForm,
  defaultAddress,
  errors,
  initialAddress,
  onSubmit,
  status,
  title,
}: AddressFormProps) {
  const formRef = useRef<InitialAddressForm>(null);
  const {countryNames, countryNamesData} = useCountriesList({
    firstCountries: ['United States', 'Canada', 'United Kingdom', 'Australia'],
  });

  const [province, setProvince] = useState(initialAddress?.province || '');
  const [country, setCountry] = useState(initialAddress?.country || '');
  const [isDefault, setIsDefault] = useState(false);

  const countries = useMemo(() => {
    return countryNames.map((name) => ({label: name, value: name}));
  }, [countryNames]);

  const provinces = useMemo(() => {
    return countryNamesData
      ?.find(({countryName}) => {
        return countryName === country;
      })
      ?.regions?.map(({name}: {name: string}) => ({label: name, value: name}));
  }, [country, countryNamesData?.length]);

  useEffect(() => {
    if (!formRef.current) return;
    if (!initialAddress) {
      setCountry('United States');
      return;
    }
    formRef.current.elements.firstName.value = initialAddress.firstName || '';
    formRef.current.elements.lastName.value = initialAddress.lastName || '';
    formRef.current.elements.company.value = initialAddress.company || '';
    formRef.current.elements.address1.value = initialAddress.address1 || '';
    formRef.current.elements.address2.value = initialAddress.address2 || '';
    formRef.current.elements.city.value = initialAddress.city || '';
    formRef.current.elements.zip.value = initialAddress.zip || '';
    formRef.current.elements.phone.value = initialAddress.phone || '';
    setProvince(initialAddress.province || '');
    setCountry(initialAddress.country || '');
    setIsDefault(
      defaultAddress?.id?.split('?')[0] === initialAddress.id?.split('?')[0],
    );
  }, [initialAddress, defaultAddress?.id]);

  return (
    <div className="rounded border border-border p-4 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-3">
        <h2 className="text-h5">{title}</h2>

        <button
          aria-label="Cancel"
          className="text-nav text-main-underline font-normal"
          onClick={closeForm}
          type="button"
        >
          Cancel
        </button>
      </div>

      <form
        className="grid grid-cols-2 gap-3"
        onSubmit={onSubmit}
        ref={formRef}
      >
        <label htmlFor="firstName" className="col-span-2 sm:col-span-1">
          <span className="input-label">First Name</span>
          <input
            className="input-text"
            name="firstName"
            placeholder="First Name"
            required
            type="text"
          />
        </label>

        <label htmlFor="lastName" className="col-span-2 sm:col-span-1">
          <span className="input-label">Last Name</span>
          <input
            className="input-text"
            name="lastName"
            placeholder="Last Name"
            required
            type="text"
          />
        </label>

        <label htmlFor="company" className="col-span-2">
          <span className="input-label">Company</span>
          <input
            className="input-text"
            name="company"
            placeholder="Company"
            type="text"
          />
        </label>

        <label htmlFor="address1" className="col-span-2">
          <span className="input-label">Address 1</span>
          <input
            className="input-text"
            name="address1"
            placeholder="Address 1"
            required
            type="text"
          />
        </label>

        <label htmlFor="address2" className="col-span-2">
          <span className="input-label">Address 2</span>
          <input
            className="input-text"
            name="address2"
            placeholder="Address 2"
            type="text"
          />
        </label>

        <label htmlFor="city" className="col-span-2 sm:col-span-1">
          <span className="input-label">City</span>
          <input
            className="input-text"
            name="city"
            placeholder="City"
            required
            type="text"
          />
        </label>

        <div className="z-[11] col-span-2 sm:col-span-1">
          <p className="input-label">State/Province</p>

          <Select
            name="province"
            onSelect={({value}) => setProvince(value)}
            options={provinces || []}
            placeholder="Select State/Province"
            selectedOption={{
              label: province,
              value: province,
            }}
          />
        </div>

        <label htmlFor="zip" className="col-span-2 sm:col-span-1">
          <span className="input-label">Zip</span>
          <input
            className="input-text"
            name="zip"
            placeholder="Zip"
            required
            type="text"
          />
        </label>

        <div className="col-span-2 sm:col-span-1">
          <p className="input-label">Country</p>

          <Select
            name="country"
            onSelect={({value}) => setCountry(value)}
            options={countries}
            placeholder="Select Country"
            selectedOption={{
              label: country,
              value: country,
            }}
          />
        </div>

        <label htmlFor="phone" className="col-span-2 sm:col-span-1">
          <span className="input-label">Phone</span>
          <input
            className="input-text"
            name="phone"
            placeholder="Phone"
            type="tel"
          />
        </label>

        <label
          htmlFor="isDefault"
          className="col-span-2 mt-2 flex items-center"
        >
          <input
            checked={isDefault}
            className="cursor-pointer"
            onChange={(e) => setIsDefault(e.target.checked)}
            type="checkbox"
          />
          <span className="ml-2 text-sm">Set as default address</span>
        </label>

        <input type="hidden" name="isDefault" value={`${isDefault}`} />

        {!!initialAddress?.id && (
          <input type="hidden" name="id" value={initialAddress.id} />
        )}

        <div className="col-span-2 mt-4 flex justify-center">
          <button
            aria-label={initialAddress ? 'Update Address' : 'Add Address'}
            className={`btn-primary w-full min-w-48 md:w-auto ${
              status.started ? 'cursor-default' : ''
            }`}
            type="submit"
          >
            {status.started ? <LoadingDots /> : buttonText}
          </button>
        </div>

        {errors?.length > 0 && (
          <ul className="col-span-2 mt-4 flex flex-col items-center gap-1">
            {errors.map((error, index) => {
              return (
                <li key={index} className="text-center text-sm text-red-500">
                  {error}
                </li>
              );
            })}
          </ul>
        )}
      </form>
    </div>
  );
}

AddressForm.displayname = 'AddressForm';
