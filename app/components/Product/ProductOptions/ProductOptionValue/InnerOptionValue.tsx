interface InnerOptionValueProps {
  isAvailable: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  value: string;
}

export function InnerOptionValue({
  isAvailable,
  isDisabled,
  isSelected,
  value,
}: InnerOptionValueProps) {
  const validClass = !isDisabled
    ? 'md:hover:border-text'
    : 'cursor-not-allowed';
  const selectedClass = isSelected ? 'border-text' : '';
  const unavailableClass = !isAvailable
    ? 'after:h-px after:w-[150%] after:rotate-[135deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-mediumGray text-gray overflow-hidden'
    : '';

  return (
    <div
      className={`relative flex h-10 min-w-14 items-center justify-center rounded border border-border px-3 transition ${validClass} ${unavailableClass} ${selectedClass}`}
    >
      {value}
    </div>
  );
}

InnerOptionValue.displayName = 'InnerOptionValue';
