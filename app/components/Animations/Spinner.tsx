import {useMemo} from 'react';

const baseWidth = 32;
const baseBorderWidth = 4;

const formatWidth = (width: string | number) => {
  if (typeof width === 'number') {
    return `${width}px`;
  }
  return `${parseInt(width, 10) || baseWidth}px`;
};

const getBorderWidth = (width: string | number) => {
  const widthNumber =
    typeof width === 'number' ? width : parseInt(width, 10) || baseWidth;
  return `${(widthNumber * (baseBorderWidth / baseWidth)).toFixed(2)}px`;
};

interface SpinnerProps {
  className?: string;
  color?: string;
  width?: string | number;
}

export function Spinner({
  className = '',
  color = 'currentColor',
  width = baseWidth,
}: SpinnerProps) {
  const formattedWidth = useMemo(() => formatWidth(width), [width]);
  const borderWidth = useMemo(() => getBorderWidth(width), [width]);

  return (
    <div
      style={{width: formattedWidth, height: formattedWidth, color}}
      className={`relative ${className}`}
    >
      <div
        className="inline-block size-full animate-spin-fast rounded-full border-solid border-current border-x-transparent border-t-transparent align-[-0.125em]"
        style={{borderWidth}}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      <div
        className="absolute inset-0 z-0 inline-block size-full rounded-full border-solid border-current opacity-[25%]"
        style={{borderWidth}}
      />
    </div>
  );
}

Spinner.displayName = 'Spinner';
