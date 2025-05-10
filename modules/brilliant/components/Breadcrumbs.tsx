import {Product} from '@shopify/hydrogen/storefront-api-types';
import {ArrowRight, ChevronRight} from 'lucide-react';
import {useMemo} from 'react';

import {Link} from '~/components/Link';
import {useParsedProductMetafields} from '~/hooks';

export function Breadcrumbs({product}: {product: Product}) {
  const metafields = useParsedProductMetafields(product);

  const collectionCrumb = useMemo(() => {
    const rawFields = metafields?.['custom.breadcrumbs']?.value || undefined;
    if (rawFields) {
      const parsedCollection = JSON.parse(rawFields);
      if (parsedCollection.length) {
        return parsedCollection[0];
      }
    }
    return undefined;
  }, [metafields]);

  const collectionCrumbLink = useMemo(() => {
    //collectionCrumb
    const collection = product.collections.nodes.find(
      ({id}) => id === collectionCrumb,
    );
    if (collection) {
      return collection;
    }
    return undefined;
  }, [collectionCrumb, product.collections.nodes]);

  return (
    <div className="flex pt-2">
      <Link className="text-primary" to={'/'}>
        Home
      </Link>
      <ChevronRight />
      {collectionCrumb && collectionCrumbLink && (
        <>
          <Link
            className="text-primary"
            to={`/collections/${collectionCrumbLink?.handle}`}
          >
            {collectionCrumbLink?.title}
          </Link>
          <ChevronRight />
        </>
      )}
      {product.title}
    </div>
  );
}
