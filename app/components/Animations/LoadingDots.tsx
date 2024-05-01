interface LoadingDotsProps {
  className?: string;
  color?: string;
  status?: string;
  withAbsolutePosition?: boolean;
  withStatusRole?: boolean;
}

export function LoadingDots({
  className = '',
  color = 'currentColor',
  status = 'Loading',
  withAbsolutePosition = false,
  withStatusRole = false,
}: LoadingDotsProps) {
  return (
    <div
      className={`pointer-events-none flex items-center justify-center gap-1.5 ${
        withAbsolutePosition
          ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          : 'relative'
      } ${className}`}
    >
      {withStatusRole ? (
        <p aria-live="assertive" className="sr-only" role="status">
          {status}
        </p>
      ) : (
        <p className="sr-only">{status}</p>
      )}
      <div
        className="size-2.5 animate-flash rounded-full [animation-delay:-0.3s]"
        style={{backgroundColor: color}}
      />
      <div
        className="size-2.5 animate-flash rounded-full [animation-delay:-0.15s]"
        style={{backgroundColor: color}}
      />
      <div
        className="size-2.5 animate-flash rounded-full"
        style={{backgroundColor: color}}
      />
    </div>
  );
}

LoadingDots.displayName = 'LoadingDots';
