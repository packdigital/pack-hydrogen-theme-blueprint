import {Link} from '~/components';
import type {Settings} from '~/lib/types';

export function FooterLegal({settings}: {settings: Settings['footer']}) {
  const {links, copyrightNotice} = {...settings?.legal};

  return (
    <div className="flex flex-col gap-x-4 gap-y-1 text-base text-current md:flex-row md:p-0 md:text-sm">
      <p>
        Copyright © {new Date().getFullYear()} {copyrightNotice}
      </p>

      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {links?.map(({link}, index) => {
          return (
            <li key={index} className="flex">
              <p
                className={`pr-4 ${index === 0 ? 'hidden' : 'block'} md:block`}
              >
                |
              </p>
              <Link
                aria-label={link?.text}
                to={link?.url}
                newTab={link?.newTab}
                type={link?.type}
              >
                <p className="hover-text-underline text-current">
                  {link?.text}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

FooterLegal.displayName = 'FooterLegal';
