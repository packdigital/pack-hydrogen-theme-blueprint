import {Link, Svg} from '~/components';
import type {Settings} from '~/lib/types';

export function FooterSocial({settings}: {settings: Settings['footer']}) {
  const {heading, links} = {...settings?.social};

  return links?.length > 0 ? (
    <div className="text-current">
      {heading && <h3 className="text-nav mb-3">{heading}</h3>}

      <ul className="flex flex-wrap gap-3.5">
        {links.map(({platform, url}, index) => {
          return (
            <li key={index}>
              <Link aria-label={platform} to={url} newTab>
                <Svg
                  className="w-6 text-current transition md:hover:opacity-80"
                  src={`/svgs/social/${platform}.svg#${platform}`}
                  title={platform}
                  viewBox="0 0 24 24"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
}

FooterSocial.displayName = 'FooterSocial';
