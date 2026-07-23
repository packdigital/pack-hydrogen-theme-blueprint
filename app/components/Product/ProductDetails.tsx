import {forwardRef, useMemo} from 'react';
import {useProduct} from '@shopify/hydrogen-react';
import sanitizeHtml from 'sanitize-html';

import {COLOR_OPTION_NAME} from '~/lib/constants';
import type {ProductWithGrouping} from '~/lib/types';
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
      const map = selectedVariant.selectedOptions.reduce(
        (acc: Record<string, string>, {name, value}) => ({
          ...acc,
          [name]: value,
        }),
        {},
      );
      // Add synthetic color from grouping subgroup if product doesn't have Color option
      const productWithGrouping = product as unknown as ProductWithGrouping;
      if (productWithGrouping.grouping && !map[COLOR_OPTION_NAME]) {
        const subgroup = productWithGrouping.grouping.subgroups?.find((sg) =>
          sg.products?.some(({handle}) => handle === product.handle),
        );
        if (subgroup) {
          map[COLOR_OPTION_NAME] = subgroup.title;
        }
      }
      return map;
    }, [selectedVariant, product]);

    const sanitizedDescription = useMemo(() => {
      return sanitizeHtml(product.descriptionHtml || '', {
        allowedAttributes: false,
      });
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
