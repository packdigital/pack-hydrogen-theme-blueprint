import {useCallback, useMemo} from 'react';

import {COLOR_OPTION_NAME, PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';
import {Image, Link} from '~/components';
import {useDataLayerClickEvents, useVariantPrices} from '~/hooks';

import type {SearchItemProps} from './Search.types';

export function SearchItem({
  closeSearch,
  index,
  item: product,
  searchTerm,
}: SearchItemProps) {
  const firstVariant = product.variants.nodes[0];
  const {price, compareAtPrice} = useVariantPrices(firstVariant);
  const {sendClickProductItemEvent} = useDataLayerClickEvents();

  const handleClick = useCallback(() => {
    sendClickProductItemEvent({
      isSearchResult: true,
      listIndex: index,
      product,
      searchTerm,
      selectedVariant: firstVariant,
    });
    closeSearch();
  }, [index, product.id]);

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
        className="bg-offWhite"
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
          width="88"
        />
      </div>

      <div className="flex flex-col justify-between gap-3">
        <div>
          <h4 className="text-h6">{product.title}</h4>

          <p className="min-h-5 text-sm text-mediumDarkGray">{color}</p>
        </div>

        <div className="flex flex-wrap gap-x-1.5">
          {compareAtPrice && (
            <p className="text-sm text-mediumDarkGray line-through">
              {compareAtPrice}
            </p>
          )}
          <p className="min-h-5 text-sm">{price}</p>
        </div>
      </div>
    </Link>
  );
}

SearchItem.displayName = 'SearchItem';
