import {memo, useCallback, useMemo} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

import {COLOR_OPTION_NAME, PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';
import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {AnalyticsEvent} from '~/components/Analytics/constants';
import {useVariantPrices} from '~/hooks';

import type {SearchItemProps} from './Search.types';

export const SearchItem = memo(
  ({closeSearch, index, item: product, searchTerm}: SearchItemProps) => {
    const firstVariant = product.variants?.nodes[0];
    const {price, compareAtPrice} = useVariantPrices(firstVariant);
    const {publish, shop} = useAnalytics();

    const handleClick = useCallback(() => {
      publish(AnalyticsEvent.PRODUCT_ITEM_CLICKED, {
        listIndex: index,
        product,
        searchTerm,
        shop,
      });
      closeSearch();
    }, [index, product.id, publish, searchTerm]);

    const color = useMemo(() => {
      return firstVariant?.selectedOptions.find(
        (option) => option.name === COLOR_OPTION_NAME,
      )?.value;
    }, [firstVariant?.id]);

    const image = useMemo(() => {
      return product.media.nodes.find((media) => {
        return media.mediaContentType === 'IMAGE';
      })?.previewImage;
    }, [product]);

    return (
      <Link
        aria-label={`View ${product.title}`}
        className="relative grid grid-cols-[5.5rem_1fr] items-center gap-3"
        to={`/products/${product.handle}`}
        onClick={handleClick}
      >
        <div
          className="bg-neutralLightest"
          style={{
            aspectRatio:
              image?.width && image?.height
                ? image.width / image.height
                : 'var(--product-image-aspect-ratio)',
          }}
        >
          <Image
            data={{
              ...image,
              altText: product.title,
            }}
            aspectRatio={
              image?.width && image?.height
                ? `${image.width}/${image.height}`
                : PRODUCT_IMAGE_ASPECT_RATIO
            }
            width="88px"
          />
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div>
            <h4 className="text-h6">{product.title}</h4>

            <p className="min-h-5 text-sm text-neutralMedium">{color}</p>
          </div>

          <div className="flex flex-wrap gap-x-1.5">
            {compareAtPrice && (
              <p className="text-sm text-neutralMedium line-through">
                {compareAtPrice}
              </p>
            )}
            <p className="min-h-5 text-sm">{price}</p>
          </div>
        </div>
      </Link>
    );
  },
);

SearchItem.displayName = 'SearchItem';
