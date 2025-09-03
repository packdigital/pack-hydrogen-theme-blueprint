import {forwardRef, useMemo} from 'react';
import {useProduct} from '@shopify/hydrogen-react';
import sanitizeHtml from 'sanitize-html';

import {useColorSwatches} from '~/hooks';

import {ProductAddToCart} from './ProductAddToCart';
import {ProductOptions} from './ProductOptions';
import type {ProductDetailsProps} from './Product.types';

export const ProductDetails = forwardRef(
  (
    {
      enabledQuantitySelector,
      isModalProduct,
      product,
      quantity,
      selectedVariant,
      setQuantity,
    }: ProductDetailsProps,
    addToCartRef: React.Ref<HTMLDivElement> | null,
  ) => {
    const {setSelectedOption} = useProduct();
    const swatchesMap = useColorSwatches();

    const selectedOptionsMap = useMemo(() => {
      if (!selectedVariant) return null;
      return selectedVariant.selectedOptions.reduce(
        (acc: Record<string, string>, {name, value}) => ({
          ...acc,
          [name]: value,
        }),
        {},
      );
    }, [selectedVariant]);

    const sanitizedDescription = useMemo(() => {
      return sanitizeHtml(product.descriptionHtml || '');
    }, [product.descriptionHtml]);

    const hideOptions =
      product.variants?.nodes?.length === 1 &&
      product.variants?.nodes?.[0]?.title === 'Default Title';

    return (
      <div className="flex flex-col gap-5">
        {!hideOptions && (
          <ProductOptions
            isModalProduct={isModalProduct}
            product={product}
            selectedOptionsMap={selectedOptionsMap}
            setSelectedOption={setSelectedOption}
            swatchesMap={swatchesMap}
          />
        )}

        <div ref={addToCartRef}>
          <ProductAddToCart
            quantity={quantity}
            enabledQuantitySelector={enabledQuantitySelector}
            selectedVariant={selectedVariant}
            setQuantity={setQuantity}
          />
        </div>

        <div
          dangerouslySetInnerHTML={{__html: sanitizedDescription}}
          className="text-sm [&>:last-child]:mb-0 [&_a]:underline [&_blockquote]:pl-8 [&_h1]:mb-3 [&_h2]:mb-3 [&_h3]:mb-3 [&_h4]:mb-3 [&_h5]:mb-3 [&_h6]:mb-3 [&_li>p]:mb-0 [&_li]:mb-2 [&_ol>li]:list-decimal [&_ol]:mb-3 [&_ol]:pl-8 [&_p]:mb-3 [&_ul>li]:list-disc [&_ul]:mb-3 [&_ul]:pl-8"
        />
      </div>
    );
  },
);

ProductDetails.displayName = 'ProductDetails';
