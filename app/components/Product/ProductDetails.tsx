import {useCallback, useEffect, useState} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {AddToCart, QuantitySelector} from '~/components';
import type {SelectedVariant} from '~/lib/types';

import {ProductOptions} from './ProductOptions';

interface ProductDetailsProps {
  enabledQuantitySelector: boolean;
  product: Product;
  selectedVariant: SelectedVariant;
}

export function ProductDetails({
  enabledQuantitySelector,
  product,
  selectedVariant,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  const hideOptions =
    product.variants?.nodes?.length === 1 &&
    product.variants?.nodes?.[0]?.title === 'Default Title';

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

  return (
    <div className="flex flex-col gap-5">
      {!hideOptions && (
        <ProductOptions product={product} selectedVariant={selectedVariant} />
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
