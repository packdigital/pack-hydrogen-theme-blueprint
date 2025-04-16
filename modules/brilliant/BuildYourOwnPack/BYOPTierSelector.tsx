import {useCallback} from 'react';
import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

interface BYOPTierSelectorProps {
  variants: ProductVariant[];
  handleSelect: (variant: ProductVariant) => void;
  selectedVariant: ProductVariant;
}

export const BYOPTierSelector: React.FC<BYOPTierSelectorProps> = ({
  variants,
  handleSelect,
  selectedVariant,
}) => {
  const formattedLabel = useCallback((variant: ProductVariant) => {
    if (!variant.price.amount) return '$0?';
    const price = parseFloat(variant.price.amount);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: variant.price.currencyCode,
      minimumFractionDigits: price % 1 === 0 ? 0 : 2, // Hide cents if whole number
    }).format(price);
  }, []);

  return (
    <div className="flex w-full flex-col justify-center ">
      <div className="flex justify-center">
        <div className="text-center">
          <h2 className="text-h2">Build your own pack</h2>
          <p className="max-w-2xl py-2">
            Discover the ultimate joy with our 3D printed, articulated mini
            animal figures. Jiggle Pets are perfect for collectors, kids, and
            anyone who loves adorable and fun toys! Choose your own pack of 6,
            12, or 25, and create a delightful, jiggly menagerie.
          </p>
        </div>
      </div>
      <div className="my-3 flex grow flex-wrap items-end justify-center gap-8">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            {variant?.id === selectedVariant?.id && <h5>Selected Pack:</h5>}

            <button
              onClick={() => handleSelect(variant)}
              className={`rounded-lg  border-2 border-blue-600 px-4  py-2 hover:bg-blue-500 hover:text-white 
                ${variant?.id === selectedVariant?.id ? 'btn-primary' : ''} 
              `}
            >
              <span className="text-xl font-bold">
                {variant.title} FOR {formattedLabel(variant)}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BYOPTierSelector;
