import {useCallback, useEffect, useMemo, useState} from 'react';
import {useProduct} from '@shopify/hydrogen-react';

import {AddToCart} from '~/components/AddToCart';
import {QuantitySelector} from '~/components/QuantitySelector';
import {useColorSwatches} from '~/hooks';

import {ProductOptions} from './ProductOptions';
import type {ProductDetailsProps} from './Product.types';

export function ProductDetails({
  enabledQuantitySelector,
  isModalProduct,
  product,
  selectedVariant,
}: ProductDetailsProps) {
  const {setSelectedOption} = useProduct();
  const swatchesMap = useColorSwatches();

  const [quantity, setQuantity] = useState(1);

  const selectedOptionsMap = useMemo(() => {
    if (!selectedVariant) return null;
    return selectedVariant.selectedOptions.reduce(
      (acc: Record<string, string>, {name, value}) => ({...acc, [name]: value}),
      {},
    );
  }, [selectedVariant]);

  const handleDecrement = useCallback(() => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  }, [quantity]);

  const handleIncrement = useCallback(() => {
    setQuantity(quantity + 1);
  }, [quantity]);

  useEffect(() => {
    if (!enabledQuantitySelector) return undefined;
    return () => {
      setQuantity(1);
    };
  }, [enabledQuantitySelector]);

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

      <div className="flex items-center gap-4">
        {enabledQuantitySelector && (
          <QuantitySelector
            disableDecrement={quantity === 1}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            productTitle={product.title}
            quantity={quantity}
          />
        )}

        <div className="flex-1">
          <AddToCart
            isPdp
            quantity={quantity}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>

      <div
        dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
        className="text-sm [&>:last-child]:mb-0 [&_a]:underline [&_blockquote]:pl-8 [&_h1]:mb-3 [&_h2]:mb-3 [&_h3]:mb-3 [&_h4]:mb-3 [&_h5]:mb-3 [&_h6]:mb-3 [&_li>p]:mb-0 [&_li]:mb-2 [&_ol>li]:list-decimal [&_ol]:mb-3 [&_ol]:pl-8 [&_p]:mb-3 [&_ul>li]:list-disc [&_ul]:mb-3 [&_ul]:pl-8"
      />
    </div>
  );
}

ProductDetails.displayName = 'ProductDetails';
