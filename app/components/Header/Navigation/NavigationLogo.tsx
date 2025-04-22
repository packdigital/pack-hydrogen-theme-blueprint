import {memo} from 'react';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';
import {useMenu} from '~/hooks';

export const NavigationLogo = memo(
  ({className = '', color}: {className?: string; color?: string}) => {
    const {closeAll} = useMenu();

    return (
      <Link
        aria-label="Go to homepage"
        className={clsx('text-text', className)}
        onClick={closeAll}
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
