import {forwardRef} from 'react';

// Tip: Change color of svg by changing the text color, e.g.:
// <Svg className="text-red-500" ... />

// Styles within an svg file within a <style> tag will not work
// Instead use style prop, e.g. <path style="stroke-width:10;" ... />

// Accessibility: icons are decorative by default (hidden from screen readers).
// Label the parent button/link instead, e.g. <button aria-label="Close">.
// Only pass `accessibleLabel` when the icon itself conveys meaning that no
// surrounding text does.

interface SvgProps {
  /** Makes the icon meaningful: renders role="img" with this name */
  accessibleLabel?: string;
  className?: string;
  src: string;
  style?: React.CSSProperties;
  /** @deprecated Ignored. Icons are decorative; use `accessibleLabel` */
  title?: string;
  viewBox: string;
}

export const Svg = forwardRef(
  (
    {
      accessibleLabel,
      className,
      src,
      title: _title,
      viewBox,
      ...props
    }: SvgProps,
    ref: React.ForwardedRef<SVGSVGElement>,
  ) => {
    const a11yProps = accessibleLabel
      ? {role: 'img', 'aria-label': accessibleLabel}
      : {'aria-hidden': true};

    return (
      <svg
        ref={ref}
        viewBox={viewBox}
        className={className || 'size-full'}
        focusable="false"
        {...a11yProps}
        {...props}
      >
        {accessibleLabel && <title>{accessibleLabel}</title>}

        <use href={src} className="pointer-events-none" />
      </svg>
    );
  },
);

Svg.displayName = 'Svg';
Svg.propTypes = {
  src(props: Record<string, string>, propName: string, componentName: string) {
    if (!props[propName]) {
      return new Error(
        `The prop \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`${props[propName]}\`.`,
      );
    }
    if (!/.+#[a-zA-Z][a-zA-Z0-9-_:.]+$/.test(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to' \`${componentName}\`. Must end with \`#\` followed by the \`id\` attributed to the svg, e.g. \`icon-name.svg#icon-name\`.`,
      );
    }
    return undefined;
  },
};
