import clsx from 'clsx';

interface Breakpoint {
  slidesPerView: number;
  spaceBetween: number;
  slidesOffsetBefore: number;
}

interface Breakpoints {
  mobile: Breakpoint;
  tablet: Breakpoint;
  desktop: Breakpoint;
}

export function SwiperSkeleton({
  breakpoints,
  children, // Skeleton of each slide
  className = '',
}: {
  breakpoints: Breakpoints;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('w-full overflow-hidden', className)}>
      {/* Mobile */}
      <SwiperBreakpointSkeleton className="md:hidden" {...breakpoints.mobile}>
        {children}
      </SwiperBreakpointSkeleton>

      {/* Tablet */}
      <SwiperBreakpointSkeleton
        className="max-md:hidden lg:hidden"
        {...breakpoints.tablet}
      >
        {children}
      </SwiperBreakpointSkeleton>

      {/* Desktop */}
      <SwiperBreakpointSkeleton
        className="max-lg:hidden"
        {...breakpoints.desktop}
      >
        {children}
      </SwiperBreakpointSkeleton>
    </div>
  );
}

SwiperSkeleton.displayName = 'SwiperSkeleton';

function SwiperBreakpointSkeleton({
  children,
  className = '',
  spaceBetween,
  slidesOffsetBefore,
  slidesPerView,
}: {
  children: React.ReactNode;
  className?: string;
} & Breakpoint) {
  return (
    <ul
      className={clsx('flex', className)}
      style={{
        gap: `${spaceBetween}px`,
        paddingLeft: `${slidesOffsetBefore}px`,
      }}
    >
      {[...new Array(Math.ceil(slidesPerView))].map((_, index) => {
        const width = `calc((100% - ${slidesOffsetBefore}px - ${spaceBetween * (slidesPerView - 1)}px) / ${slidesPerView})`;
        return (
          <li key={index} style={{width, minWidth: width}}>
            {children}
          </li>
        );
      })}
    </ul>
  );
}

SwiperBreakpointSkeleton.displayName = 'SwiperBreakpointSkeleton';
