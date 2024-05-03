import {useEffect, useState} from 'react';

/**
 * Get list of countries and their data
 * @param firstCountries - Array of country names to be shown first
 * @returns object with country names array and country data array
 * @example
 * ```js
 * const {countryNames, countryNamesData} = useCountriesList({firstCountries: ['United States', 'Canada']});
 * ```
 */

const getCountries = async ({
  firstCountries = [],
}: {
  firstCountries: string[];
}) => {
  try {
    const data = await import('country-region-data/data.json');
    const initialDataList = data.default;
    const firstCountriesMap = firstCountries.reduce(
      (acc: Record<string, any>, value) => {
        acc[value] = {};
        return acc;
      },
      {},
    );
    const initialNameList = initialDataList.map((item) => {
      if (firstCountriesMap[item.countryName]) {
        firstCountriesMap[item.countryName] = item;
      }
      return item.countryName;
    });
    const finalDataList = [
      ...Object.values(firstCountriesMap),
      ...initialDataList,
    ];
    const finalNameList = [
      ...Object.keys(firstCountriesMap),
      ...initialNameList,
    ];
    return {
      finalDataList,
      finalNameList,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

interface CountriesData {
  countryNames: string[];
  countryNamesData: Record<string, any>[];
}

export const useCountriesList = (
  props?: {firstCountries: string[]} | undefined,
): CountriesData => {
  const {firstCountries = []} = {...props};
  const [countriesData, setCountriesData] = useState<CountriesData>({
    countryNames: [],
    countryNamesData: [],
  });
  const firstCountriesList = Array.isArray(firstCountries)
    ? firstCountries
    : [];

  const awaitCountries = async () => {
    const data = await getCountries({firstCountries: firstCountriesList});
    setCountriesData({
      countryNames: data.finalNameList,
      countryNamesData: data.finalDataList,
    });
  };

  useEffect(() => {
    if (
      countriesData.countryNames.length &&
      countriesData.countryNamesData.length
    )
      return;
    awaitCountries();
  }, []);

  return countriesData;
};
