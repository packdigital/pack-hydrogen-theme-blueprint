import {memo} from 'react';

import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';

export const NavigationLogo = memo(
  ({
    className = '',
    color,
    handleCloseMobileMenu,
  }: {
    className?: string;
    color?: string;
    handleCloseMobileMenu: () => void;
  }) => {
    return (
      <Link
        aria-label="Go to homepage"
        className={`text-text ${className}`}
        onClick={handleCloseMobileMenu}
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
