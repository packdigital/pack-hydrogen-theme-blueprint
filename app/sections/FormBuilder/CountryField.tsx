import clsx from 'clsx';

import {useCountriesList} from '~/hooks';

import type {CountryFieldProps} from './FormBuilder.types';

const firstCountries = [
  'United States',
  'Canada',
  'United Kingdom',
  'France',
  'Australia',
  'New Zealand',
  '--',
];

export function CountryField({
  selectClass,
  name,
  placeholder,
  required,
}: CountryFieldProps) {
  const {countryNames} = useCountriesList();

  const countryOptions = !countryNames?.length
    ? null
    : ['', ...firstCountries, ...countryNames];

  return (
    <select
      className={clsx(selectClass)}
      id={name}
      name={name}
      required={required}
      title="Select country"
    >
      {countryOptions?.map((country, index) => (
        <option
          disabled={index === 0 || country === '--'}
          key={`${country}.${index}`}
          selected={index === 0}
          value={country}
        >
          {country || placeholder}
        </option>
      ))}
    </select>
  );
}

CountryField.displayName = 'CountryField';
