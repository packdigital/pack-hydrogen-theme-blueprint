import {memo} from 'react';

import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';

export const NavigationLogo = memo(
  ({className = '', color}: {className?: string; color?: string}) => {
    return (
      <Link
        aria-label="Go to homepage"
        className={`text-text ${className}`}
        style={{color}}
        to="/"
      >
        <Svg
          className="h-8 text-current"
          src="/svgs/pack-logo.svg#pack-logo"
          title="Storefront logo"
          viewBox="0 0 44 34"
        />
      </Link>
    );
  },
);

NavigationLogo.displayName = 'NavigationLogo';
