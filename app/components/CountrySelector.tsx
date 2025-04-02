import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useFetcher, useLocation} from '@remix-run/react';
import {useInView} from 'react-intersection-observer';
import {useCart} from '@shopify/hydrogen-react';
import type {Localization} from '@shopify/hydrogen/storefront-api-types';

import {DEFAULT_LOCALE} from '~/lib/constants';
import type {I18nLocale} from '~/lib/types';
import {pathWithLocalePrefix, pathWithoutLocalePrefix} from '~/lib/utils';
import {Select} from '~/components/Select';
import {useLocale} from '~/hooks';

export const CountrySelector = memo(
  ({openFrom = 'top'}: {openFrom?: 'top' | 'bottom'}) => {
    const {ref, inView} = useInView({
      threshold: 0,
      triggerOnce: true,
    });
    const {pathPrefix, label} = useLocale();
    const localizationFetcher = useFetcher<{localization: Localization}>({
      key: 'countries',
    }); // only countries within the store's markets will be returned
    const redirectFetcher = useFetcher({key: 'redirect'});

    const [countries, setCountries] = useState<Record<
      string,
      I18nLocale
    > | null>(null);

    const {pathname, search} = useLocation();
    const {buyerIdentityUpdate} = useCart();

    const {availableCountries} = {
      ...localizationFetcher?.data?.localization,
    };

    const countryOptions = useMemo(() => {
      if (!countries) return [];
      return Object.values(countries).map(({pathPrefix, label}) => {
        return {label, value: pathPrefix};
      });
    }, [countries]);

    const handleSelect = useCallback(
      ({value}: {value: string}) => {
        if (!countries || typeof value !== 'string') return;
        const countryLocale = countries[value || 'default'];
        if (!countryLocale) return;
        const pathnameWithoutLocale = pathWithoutLocalePrefix(
          `${pathname}${search}`,
          pathPrefix,
        );
        const countryUrlPath = pathWithLocalePrefix(
          pathnameWithoutLocale,
          countryLocale.pathPrefix,
        );
        buyerIdentityUpdate({countryCode: countryLocale.country});
        redirectFetcher.submit(
          {to: countryUrlPath},
          {method: 'POST', action: `${pathPrefix}/api/redirect`},
        );
      },
      [buyerIdentityUpdate, countries, pathname, search, pathPrefix],
    );

    useEffect(() => {
      if (!inView) return;
      localizationFetcher.load(`${pathPrefix}/api/countries`);
    }, [inView]);

    useEffect(() => {
      if (!availableCountries?.length) return;
      const alphabeticallySortedCountries = [...availableCountries].sort(
        (a, b) => a.name.localeCompare(b.name),
      );
      const countriesAsLocalesMap = alphabeticallySortedCountries.reduce(
        (acc, country) => {
          const {isoCode: countryCode, currency, name} = country;
          const {isoCode: currencyCode, symbol} = currency;
          const language = DEFAULT_LOCALE.language;
          const pathPrefix = `/${language}-${countryCode}`.toLowerCase();
          const isDefaultCountry = countryCode === DEFAULT_LOCALE.country;
          const data = {
            name,
            label: `${name} (${currencyCode} ${symbol})`,
            language: language.toUpperCase(),
            country: countryCode,
            currency: currencyCode,
            pathPrefix: isDefaultCountry ? '' : pathPrefix,
          };
          return {...acc, [isDefaultCountry ? 'default' : pathPrefix]: data};
        },
        {},
      );
      setCountries(countriesAsLocalesMap);
    }, [!!availableCountries?.length]);

    return (
      <div ref={ref} className="w-[250px]">
        <Select
          onSelect={handleSelect}
          options={countryOptions}
          placeholder="Select Country"
          selectedOption={{
            label: countries?.[pathPrefix || 'default']?.label || label,
            value: pathPrefix,
          }}
          placeholderClass="text-text"
          openFrom={openFrom}
        />
      </div>
    );
  },
);
