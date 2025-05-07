import {ProductOptionValue} from '@shopify/hydrogen-react/storefront-api-types';
import {useMemo} from 'react';

import {ProductOptionVariantImageMap} from '../../Product.types';
import {OnSelect} from '../ProductOptions.types';

import {Card, CardContent} from '~/components/ui/card';
import {SelectedVariant} from '~/lib/types';

export function ProductOptionValueVariantImage({
  optionsImageVariantMap,
  optionValue,
  selectedVariantFromOptions,
  isSelected,
  onSelect,
  setSelectedOption,
  optionName,
}: {
  optionsImageVariantMap: ProductOptionVariantImageMap | undefined;
  optionValue: ProductOptionValue;
  selectedVariantFromOptions: SelectedVariant;
  isSelected: boolean;
  onSelect?: OnSelect;
  setSelectedOption: (name: string, value: string) => void;
  optionName: string;
}) {
  const {optionImageUrl, optionImageAlt} = useMemo(() => {
    const values = {
      optionImageUrl: '',
      optionImageAlt: '',
    };

    if (optionsImageVariantMap) {
      values.optionImageUrl = optionsImageVariantMap[optionValue.id]?.url ?? '';
      values.optionImageAlt =
        optionsImageVariantMap[optionValue.id]?.altText ?? '';
    }

    return values;
  }, [optionValue.id, optionsImageVariantMap]);

  return (
    <Card
      className={`h-full ${isSelected ? 'border border-2 border-primary' : ''}`}
      onClick={() => {
        if (isSelected) return;
        setSelectedOption(optionName, optionValue.name);
        if (typeof onSelect === 'function') {
          onSelect({
            selectedVariant: selectedVariantFromOptions,
            optionName,
            optionValue,
          });
        }
      }}
    >
      <CardContent className="flex h-full flex-col justify-between p-1">
        <div className="overflow-hidden rounded-lg">
          <img src={optionImageUrl} alt={optionImageAlt} />
        </div>
        <div className="flex items-center justify-center p-1">
          <p className="text-center text-xs truncate">
            {selectedVariantFromOptions?.title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
