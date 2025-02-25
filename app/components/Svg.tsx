import {forwardRef} from 'react';

// Tip: Change color of svg by changing the text color, e.g.:
// <Svg className="text-red-500" ... />

// Styles within an svg file within a <style> tag will not work
// Instead use style prop, e.g. <path style="stroke-width:10;" ... />

interface SvgProps {
  className?: string;
  src: string;
  style?: React.CSSProperties;
  title?: string;
  viewBox: string;
}

export const Svg = forwardRef(
  (
    {className, src, title, viewBox, ...props}: SvgProps,
    ref: React.ForwardedRef<SVGSVGElement>,
  ) => {
    return (
      <svg
        ref={ref}
        viewBox={viewBox}
        className={className || 'size-full'}
        {...props}
      >
        {title && <title>{title}</title>}

        <use href={src} className="pointer-events-none" />
      </svg>
    );
  },
);

Svg.displayName = 'Svg';
Svg.propTypes = {
  src(props, propName, componentName) {
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
