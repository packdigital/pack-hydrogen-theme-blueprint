import {useCallback} from 'react';

import {SIZE_OPTION_NAME} from '~/lib/constants';
import {useMenu} from '~/hooks';

import type {ProductOptionValuesLabelProps} from './ProductOptions.types';

export function ProductOptionValuesLabel({
  name,
  selectedValue,
}: ProductOptionValuesLabelProps) {
  const {openModal} = useMenu();

  const handleSizeGuideClick = useCallback(() => {
    // example modal
    openModal(
      <div>
        <h2 className="text-h3 mb-6 text-center">Size Guide</h2>
        <div className="h-[30rem] bg-neutralLightest" />
      </div>,
    );
  }, []);

  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-nav leading-6">{name}</h3>

        {selectedValue && (
          <p className="text-base text-neutralMedium">{selectedValue}</p>
        )}
      </div>

      {name === SIZE_OPTION_NAME && (
        <button
          className="text-underline text-xs"
          onClick={handleSizeGuideClick}
          type="button"
        >
          Size Guide
        </button>
      )}
    </div>
  );
}

ProductOptionValuesLabel.displayName = 'ProductOptionValuesLabel';
