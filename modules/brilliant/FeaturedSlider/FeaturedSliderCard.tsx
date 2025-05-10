import {useAnalytics} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import {useCallback, useMemo} from 'react';

import {ProductItemPrice} from '../../brilliant/ProductItem/ProductItemPrice';
import {AddToCart} from '../AddToCart/AddToCart';

import {getPriorityTag} from './tagPriority';

import {AnalyticsEvent} from '~/components/Analytics/constants';
import {Link} from '~/components/Link';
import {ProductItemMedia} from '~/components/ProductItem/ProductItemMedia';
import {Card} from '~/components/ui/card';
import {useParsedProductMetafields} from '~/hooks';
import {COLOR_OPTION_NAME} from '~/lib/constants';
import {SelectedVariant} from '~/lib/types';
//import type {ProductCms} from '~/lib/types';

export function FeaturedSliderCard({
  onClick,
  product,
  design,
}: {
  onClick?: () => void;
  product: Product;
  design: 'expanded' | 'normal';
}) {
  const {publish, shop} = useAnalytics();
  const priorityTag = getPriorityTag(product.tags);

  const selectedVariant = useMemo((): SelectedVariant => {
    return product?.variants?.nodes?.[0];
  }, [product]);

  const metafields = useParsedProductMetafields(product);

  const productFeaturedTitle = useMemo(
    () => metafields?.['custom.featured_title']?.value || product.title,
    [metafields, product.title],
  );

  const productExtraDescription = useMemo(
    () => metafields?.['custom.featured_description']?.value,
    [metafields],
  );

  const handleClick = useCallback(() => {
    publish(AnalyticsEvent.PRODUCT_ITEM_CLICKED, {
      listIndex: 0,
      product,
      selectedVariant,
      searchTerm: false,
      shop,
    });
    if (typeof onClick === 'function') onClick();
  }, [publish, product, selectedVariant, shop, onClick]);

  const productUrl = useMemo(() => {
    const productHandle = selectedVariant?.product?.handle;
    if (!productHandle) return '';
    const searchParams = new URLSearchParams();

    selectedVariant.selectedOptions.forEach(({name, value}) => {
      if (name !== COLOR_OPTION_NAME) return;
      searchParams.set(name, value);
    });

    return `/products/${productHandle}${
      searchParams ? `?${searchParams}` : ''
    }`;
  }, [selectedVariant]);

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-md border bg-white">
      {/* Top section: Product Image */}
      <div className="relative">
        {priorityTag && design === 'expanded' && (
          <div
            className={`${priorityTag.color} absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-xs`}
          >
            {priorityTag.tag}
          </div>
        )}
        <Link
          aria-label={productFeaturedTitle}
          to={productUrl}
          onClick={handleClick}
        >
          <ProductItemMedia
            hasGrouping={false}
            selectedProduct={product}
            selectedVariant={selectedVariant}
          />
        </Link>
      </div>

      {/* Bottom section: Content */}
      <div className="flex flex-1 flex-col p-3">
        {design === 'normal' && productFeaturedTitle && (
          <Link
            aria-label={productFeaturedTitle}
            to={productUrl}
            onClick={handleClick}
          >
            <h3 className="text-base font-normal">{productFeaturedTitle}</h3>
          </Link>
        )}

        {design === 'expanded' && productFeaturedTitle && (
          <Link
            aria-label={productFeaturedTitle}
            to={productUrl}
            onClick={handleClick}
          >
            <h3 className="text-lg font-semibold">{productFeaturedTitle}</h3>
          </Link>
        )}

        {design === 'expanded' && productExtraDescription && (
          <p className="mt-1 text-sm text-gray-600">
            {productExtraDescription}
          </p>
        )}

        {/* Push the price/cart to bottom */}
        <div className="flex-1" />

        <div className="flex flex-row items-center justify-between pt-2">
          <div
            className={`${design === 'expanded' ? 'text-lg' : 'text-sm'}  font-bold`}
          >
            <ProductItemPrice selectedVariant={selectedVariant} />
          </div>
          <div>
            <AddToCart
              size={`${design === 'expanded' ? 'default' : 'sm'}`}
              addToCartText="Add to Cart"
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
