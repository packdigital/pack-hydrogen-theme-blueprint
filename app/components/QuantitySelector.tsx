import clsx from 'clsx';

import {Spinner} from '~/components/Animations';
import {Svg} from '~/components/Svg';

interface QuantitySelectorProps {
  className?: string;
  disabled?: boolean;
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  handleDecrement: () => void;
  handleIncrement: () => void;
  hideButtons?: boolean;
  isUpdating?: boolean;
  productTitle?: string;
  quantity: number;
}

export function QuantitySelector({
  className = '',
  disabled = false,
  disableDecrement = false,
  disableIncrement = false,
  handleDecrement,
  handleIncrement,
  hideButtons = false,
  isUpdating = false,
  productTitle = 'product',
  quantity = 1,
}: QuantitySelectorProps) {
  return (
    <div
      className={clsx(
        'flex w-full max-w-[6.5rem] items-center justify-between',
        className,
      )}
    >
      <button
        aria-label={`Reduce quantity of ${productTitle} by 1 to ${
          quantity - 1
        }`}
        className={clsx(
          'relative size-8 rounded-full border border-border transition disabled:opacity-50',
          hideButtons && 'invisible',
          disableDecrement
            ? 'cursor-not-allowed'
            : 'md:hover:border-neutralLight',
        )}
        disabled={disabled || isUpdating || disableDecrement}
        onClick={handleDecrement}
        type="button"
      >
        <Svg
          className="absolute left-1/2 top-1/2 w-4 -translate-x-1/2 -translate-y-1/2 text-text"
          src="/svgs/minus.svg#minus"
          title="Minus"
          viewBox="0 0 24 24"
        />
      </button>

      <div className="relative flex flex-1 items-center justify-center">
        {isUpdating ? (
          <Spinner color="var(--neutral-light)" width="20" />
        ) : (
          <p className="w-full text-center outline-none">{quantity}</p>
        )}
      </div>

      <button
        aria-label={`Increase quantity of ${productTitle} by 1 to ${
          quantity + 1
        }`}
        className={clsx(
          'relative size-8 rounded-full border border-border transition disabled:opacity-50 md:hover:border-neutralLight',
          hideButtons && 'invisible',
          disableIncrement
            ? 'cursor-not-allowed'
            : 'md:hover:border-neutralLight',
        )}
        disabled={disabled || isUpdating || disableIncrement}
        onClick={handleIncrement}
        type="button"
      >
        <Svg
          className="absolute left-1/2 top-1/2 w-4 -translate-x-1/2 -translate-y-1/2 text-text"
          src="/svgs/plus.svg#plus"
          title="Plus"
          viewBox="0 0 24 24"
        />
      </button>
    </div>
  );
}

QuantitySelector.displayName = 'QuantitySelector';
