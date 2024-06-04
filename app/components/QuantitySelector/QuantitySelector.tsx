import {Spinner, Svg} from '~/components';

interface QuantitySelectorProps {
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
    <div className="flex w-full max-w-[6.5rem] items-center justify-between">
      <button
        aria-label={`Reduce quantity of ${productTitle} by 1 to ${
          quantity - 1
        }`}
        className={`relative size-8 rounded-full border border-border transition disabled:opacity-50 ${
          hideButtons ? 'invisible' : ''
        } ${disableDecrement ? 'cursor-not-allowed' : 'md:hover:border-gray'}`}
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
          <Spinner color="var(--gray)" width="20" />
        ) : (
          <p className="w-full text-center outline-none">{quantity}</p>
        )}
      </div>

      <button
        aria-label={`Increase quantity of ${productTitle} by 1 to ${
          quantity + 1
        }`}
        className={`relative size-8 rounded-full border border-border transition disabled:opacity-50 md:hover:border-gray ${
          hideButtons ? 'invisible' : ''
        } ${disableIncrement ? 'cursor-not-allowed' : 'md:hover:border-gray'}`}
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
