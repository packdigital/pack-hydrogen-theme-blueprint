import {useRootLoaderData} from '~/hooks';

export const useGeoLocation = () => {
  const {oxygen} = useRootLoaderData();

  return oxygen?.buyer;
};

useGeoLocation.displayName = 'useGeoLocation';
