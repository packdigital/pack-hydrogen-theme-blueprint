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
  const paddingClasses = `${tabletDesktopPaddingTop} ${tabletDesktopPaddingBottom} ${mobilePaddingTop} ${mobilePaddingBottom}`;
  const marginClasses = `${tabletDesktopMarginBottom} ${mobileMarginBottom}`;
  return (
    <div
      className={`relative ${paddingClasses} ${marginClasses}`}
      style={{backgroundColor: bgColor}}
    >
      {children}
    </div>
  );
}

Container.displayName = 'SectionContainer';
