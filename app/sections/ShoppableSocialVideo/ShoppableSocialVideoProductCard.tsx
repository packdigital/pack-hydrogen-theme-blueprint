import {useCallback, useEffect, useMemo, useState} from 'react';
import hexToRgba from 'hex-to-rgba';
import equal from 'fast-deep-equal';
import clsx from 'clsx';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';

import {AddToCart} from '~/components/AddToCart';
import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {ProductDraftMediaOverlay} from '~/components/Product';
import {ProductOptions} from '~/components/Product/ProductOptions';
import {ProductStars} from '~/components/ProductStars';
import {QuantitySelector} from '~/components/QuantitySelector';
import {Svg} from '~/components/Svg';
import {useProductByHandle, useProductModal, useVariantPrices} from '~/hooks';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';
import type {AspectRatio, ProductWithStatus} from '~/lib/types';

import {
  productSettingsDefaults as productDefaults,
  sliderSettingsDefaults as sliderDefaults,
} from './ShoppableSocialVideo.schema';
import type {ShoppableSocialVideoProductCardProps} from './ShoppableSocialVideo.types';

const generateSelectedOptionsMap = (
  selectedVariant: ProductVariant | undefined,
) => {
  if (!selectedVariant) return {};
  return selectedVariant?.selectedOptions?.reduce((acc, option) => {
    return {...acc, [option.name]: option.value};
  }, {});
};

export function ShoppableSocialVideoProductCard({
  product: passedProduct,
  image,
  isActive,
  badge,
  description,
  productSettings,
  sliderSettings,
  swatchesMap,
}: ShoppableSocialVideoProductCardProps) {
  const loaderProduct = passedProduct.id ? passedProduct : null;
  /* While in customizer, fetch the full product if not originally fetched in loader */
  const customizerProduct = useProductByHandle(
    !loaderProduct ? passedProduct.handle : null,
  );

  const product = useMemo(() => {
    return customizerProduct || loaderProduct;
  }, [customizerProduct, loaderProduct?.id]);

  const [showOptions, setShowOptions] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(product?.variants?.nodes?.[0]);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<
    Record<string, string>
  >(generateSelectedOptionsMap(selectedVariant));

  const setSelectedOption = useCallback(
    (option: string, value: string) => {
      setSelectedOptionsMap({...selectedOptionsMap, [option]: value});
    },
    [selectedOptionsMap],
  );

  const {openProductUrl} = useProductModal({product, selectedVariant});

  useEffect(() => {
    if (!isActive) setShowOptions(false);
  }, [isActive]);

  useEffect(() => {
    if (product?.handle !== selectedVariant?.product?.handle) {
      setSelectedVariant(product?.variants?.nodes?.[0]);
      setSelectedOptionsMap(
        generateSelectedOptionsMap(product?.variants?.nodes?.[0]),
      );
    }
  }, [product, selectedVariant]);

  useEffect(() => {
    setSelectedVariant(
      product?.variants?.nodes?.find((variant) => {
        return equal(generateSelectedOptionsMap(variant), selectedOptionsMap);
      }),
    );
  }, [selectedOptionsMap]);

  const {
    enabledStarRating = productDefaults.enabledStarRating,
    enabledQuantitySelector = productDefaults.enabledQuantitySelector,
    optionsBtnText = productDefaults.optionsBtnText,
    optionsBtnStyle = productDefaults.optionsBtnStyle,
    atcBtnText = productDefaults.atcBtnText,
    atcBtnStyle = productDefaults.atcBtnStyle,
    viewText = productDefaults.viewText,
    badgeBgColor = productDefaults.badgeBgColor,
    badgeTextColor = productDefaults.badgeTextColor,
  } = {...productSettings};
  const {
    slideBgColor = sliderDefaults.slideBgColor,
    slideBgOpacity = sliderDefaults.slideBgOpacity,
    slideBgBlur = sliderDefaults.slideBgBlur,
    slideTextColor = sliderDefaults.slideTextColor,
  } = {...sliderSettings};

  const {price, compareAtPrice} = useVariantPrices(selectedVariant);

  const productImage =
    image || selectedVariant?.image || product?.featuredImage;
  const productImageSrc =
    image?.url || selectedVariant?.image?.url || product?.featuredImage?.url;
  const hasOneVariant = product?.variants?.nodes?.length === 1;
  const aspectRatio =
    productImage?.width && productImage?.height
      ? (`${productImage.width}/${productImage.height}` as AspectRatio)
      : PRODUCT_IMAGE_ASPECT_RATIO;
  const hideOptions =
    product?.variants?.nodes?.length === 1 &&
    product?.variants?.nodes?.[0]?.title === 'Default Title';

  return (
    <div
      className="relative overflow-hidden rounded-md p-3"
      style={{
        backgroundColor: hexToRgba(slideBgColor, slideBgOpacity),
        color: slideTextColor,
        backdropFilter: `blur(${slideBgBlur}px)`,
      }}
    >
      <div
        className={clsx(
          'grid grid-cols-[auto_1fr] gap-3',
          showOptions && 'pb-4',
        )}
      >
        <div className="relative overflow-hidden">
          <Image
            data={{
              altText: product?.title,
              url: productImageSrc,
              width: productImage?.width,
              height: productImage?.height,
            }}
            aspectRatio={aspectRatio}
            width="100px"
            sizes="200px"
          />

          {(product as ProductWithStatus)?.status === 'DRAFT' && (
            <ProductDraftMediaOverlay />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-2.5">
              <div className="space-y-1">
                {badge && (
                  <div
                    className="flex h-5 w-fit items-center justify-center whitespace-nowrap rounded px-1.5 text-xs uppercase"
                    style={{
                      backgroundColor: badgeBgColor,
                      color: badgeTextColor,
                    }}
                  >
                    {badge}
                  </div>
                )}

                <h1 className="text-h5 theme-product-card-text-color flex-1">
                  {product?.title}
                </h1>
              </div>

              <button
                aria-label={
                  showOptions ? 'Hide product options' : 'Show product options'
                }
                className="theme-product-card-text-color mr-[-4px] mt-[-4px] flex size-5 items-center justify-center"
                type="button"
                onClick={() => setShowOptions(!showOptions)}
              >
                {showOptions ? (
                  <Svg
                    className="w-3.5"
                    src="/svgs/minus.svg#minus"
                    viewBox="0 0 24 24"
                  />
                ) : (
                  <Svg
                    className="w-3.5"
                    src="/svgs/plus.svg#plus"
                    viewBox="0 0 24 24"
                  />
                )}
              </button>
            </div>

            {enabledStarRating && product?.id && (
              <div className="theme-product-card-text-color">
                <ProductStars id={product.id} />
              </div>
            )}

            <div className="theme-product-card-text-color space-x-1.5 truncate text-base">
              {compareAtPrice && (
                <span className="line-through opacity-60">
                  {compareAtPrice}
                </span>
              )}
              <span className="">{price}</span>
            </div>
          </div>

          {showOptions && description && (
            <p className="theme-product-card-text-color-faded text-xs">
              {description}
            </p>
          )}

          {showOptions && (
            <Link
              aria-label={viewText}
              className="text-underline theme-product-card-text-color-faded self-start text-right text-xs"
              to={openProductUrl}
              onClick={() => {
                if (!openProductUrl) return;
                setTimeout(() => setShowOptions(false), 1000);
              }}
            >
              {viewText}
            </Link>
          )}

          {!showOptions && !hasOneVariant && (
            <button
              aria-label={optionsBtnText}
              className={clsx('gap-2', optionsBtnStyle)}
              type="button"
              onClick={() => setShowOptions(true)}
            >
              <Svg
                className="w-5"
                src="/svgs/settings.svg#settings"
                viewBox="0 0 24 24"
              />

              <span>{optionsBtnText}</span>
            </button>
          )}

          {!showOptions && hasOneVariant && (
            <AddToCart
              addToCartText={atcBtnText}
              price={price}
              selectedVariant={selectedVariant}
            />
          )}
        </div>
      </div>

      {showOptions && product && (
        <div>
          {!hideOptions && (
            <ProductOptions
              isShoppableProductCard
              product={product}
              selectedOptionsMap={selectedOptionsMap}
              setSelectedOption={setSelectedOption}
              swatchesMap={swatchesMap}
            />
          )}

          <div className="mt-3 flex gap-3">
            {enabledQuantitySelector && (
              <QuantitySelector
                className="max-w-[100px]"
                disableDecrement={quantity <= 1}
                handleDecrement={() => setQuantity(quantity - 1)}
                handleIncrement={() => setQuantity(quantity + 1)}
                productTitle={product?.title}
                quantity={quantity}
              />
            )}

            <AddToCart
              addToCartText={atcBtnText}
              className={clsx(atcBtnStyle)}
              containerClassName="flex-1"
              onAddToCart={() => setShowOptions(false)}
              quantity={quantity}
              price={price}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      )}
    </div>
  );
}

ShoppableSocialVideoProductCard.displayName = 'ShoppableSocialVideoProductCard';
