import {useEffect, useRef, useState} from 'react';
import {useLocation} from '@remix-run/react';

import {LoadingDots} from '~/components';
import {useCustomer, useSettings} from '~/hooks';
import {useCustomerUpdateProfile} from '~/lib/customer';

interface ProfileFormElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
}

interface ProfileForm extends HTMLFormElement {
  elements: ProfileFormElements;
}

export function Profile() {
  const formRef = useRef<ProfileForm>(null);
  const {updateCustomerDetails, errors, status} = useCustomerUpdateProfile();
  const customer = useCustomer();
  const {pathname} = useLocation();
  const {account} = useSettings();

  const [buttonText, setButtonText] = useState('Save');

  const {menuItems} = {...account?.menu};
  const heading = menuItems?.find(({link}) => pathname.startsWith(link?.url))
    ?.link?.text;

  useEffect(() => {
    if (!formRef.current) return;
    if (!customer) return;
    formRef.current.elements.firstName.value = customer.firstName || '';
    formRef.current.elements.lastName.value = customer.lastName || '';
  }, [customer]);

  useEffect(() => {
    if (!status.success) return;
    setButtonText('Saved!');
    setTimeout(() => setButtonText('Save'), 1000);
  }, [status.success]);

  return (
    <div className="flex flex-col">
      <h1 className="text-h4 mb-8 md:mb-10">{heading}</h1>

      <form
        className="grid grid-cols-2 gap-3 rounded border border-border p-4 sm:p-6"
        ref={formRef}
        onSubmit={updateCustomerDetails}
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

        <label htmlFor="email" className="col-span-2">
          <span className="input-label">Email</span>
          <input
            className="input-text text-mediumDarkGray"
            disabled
            name="email"
            placeholder="Email"
            required
            type="email"
            value={customer?.email || ''}
          />
        </label>

        <div className="col-span-2 flex justify-center">
          <button
            aria-label="Save to update profile"
            className={`btn-primary mt-4 w-full min-w-40 md:w-auto ${
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

Profile.displayName = 'Profile';
