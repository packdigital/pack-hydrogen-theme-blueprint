import type {ProductOptionValuesLabelProps} from './ProductOptions.types';

import {useMenu} from '~/hooks';

export function ProductOptionValuesLabel({
  name,
  selectedValue,
}: ProductOptionValuesLabelProps) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-nav leading-6">{name}</h3>

        {selectedValue && (
          <p className="text-base text-neutralMedium">{selectedValue}</p>
        )}
      </div>
    </div>
  );
}

ProductOptionValuesLabel.displayName = 'ProductOptionValuesLabel';
