import {Banner} from '~/sections/Banner';
import {useRootLoaderData} from '~/hooks';

export function NotFound() {
  const {siteSettings} = useRootLoaderData();

  return (
    <Banner cms={{...siteSettings?.data?.siteSettings?.settings?.notFound}} />
  );
}

NotFound.displayName = 'NotFound';
