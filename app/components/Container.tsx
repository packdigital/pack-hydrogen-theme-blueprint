import clsx from 'clsx';
import {ErrorBoundary} from 'react-error-boundary';

import type {ContainerSettings} from '~/settings/container';

export function Container({
  children,
  container,
}: {
  children: React.ReactNode;
  container: ContainerSettings;
}) {
  const {
    bgColor,
    tabletDesktopPaddingTop,
    tabletDesktopPaddingBottom,
    tabletDesktopMarginBottom,
    mobilePaddingTop,
    mobilePaddingBottom,
    mobileMarginBottom,
  } = {...container};

  return (
    <ErrorBoundary
      fallbackRender={() => (
        <div className="p-6">
          <pre
            aria-live="assertive"
            className="container mx-auto w-full whitespace-pre-wrap rounded-lg border border-dashed border-red-400 p-6 text-center text-red-400"
            role="alert"
          >
            An error has occurred in this section.
          </pre>
        </div>
      )}
    >
      <div
        className={clsx(
          'relative',
          tabletDesktopPaddingTop,
          tabletDesktopPaddingBottom,
          mobilePaddingTop,
          mobilePaddingBottom,
          tabletDesktopMarginBottom,
          mobileMarginBottom,
        )}
        style={{backgroundColor: bgColor}}
      >
        {children}
      </div>
    </ErrorBoundary>
  );
}

Container.displayName = 'SectionContainer';
