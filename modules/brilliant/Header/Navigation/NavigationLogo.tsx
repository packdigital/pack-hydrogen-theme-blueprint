import {memo} from 'react';

import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';

export const NavigationLogo = memo(
  ({className = '', color}: {className?: string; color?: string}) => {
    return (
      <Link
        aria-label="Go to homepage"
        className={`flex items-center justify-center text-text ${className}`}
        style={{color}}
        to="/"
      >
        <div className="rounded-full bg-white">
          <Svg
            className="h-10 text-current"
            src="/svgs/brilliant-layers-logo.svg#brilliant-layers-logo"
            title="Brilliant Layers logo"
            viewBox="8 1 180 180"
          />
        </div>
        <h3 className="px-2 text-2xl text-white text-shadow">
          Brilliant Layers
        </h3>
      </Link>
    );
  },
);

NavigationLogo.displayName = 'NavigationLogo';
