import {useMemo} from 'react';

import type {CountryFieldProps} from './FormBuilder.types';
import {useCountriesList} from '~/hooks';

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

  const countryOptions = useMemo(() => {
    if (!countryNames?.length) return null;
    return ['', ...firstCountries, ...countryNames];
  }, [countryNames?.length, firstCountries]);

  return (
    <select
      className={`${selectClass}`}
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
