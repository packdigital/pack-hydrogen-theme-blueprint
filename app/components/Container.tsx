import clsx from 'clsx';

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
  );
}

Container.displayName = 'SectionContainer';
