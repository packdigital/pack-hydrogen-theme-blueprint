import {MobileMenuItem} from '~/components/Footer/MobileMenuItem';
import {Link} from '~/components/Link';
import type {Settings} from '~/lib/types';

export function FooterMenu({settings}: {settings: Settings['footer']}) {
  const {menuItems} = {...settings?.menu};

  return (
    <>
      {/* mobile */}
      <ul className="grid grid-cols-1 text-current md:hidden md:grid-cols-3 lg:grid-cols-4">
        {menuItems?.map((item, menuIndex) => {
          return (
            <li key={menuIndex}>
              <MobileMenuItem item={item} />
            </li>
          );
        })}
      </ul>

      {/* desktop */}
      <ul className="hidden grid-cols-1 gap-x-6 gap-y-8 px-4 md:grid md:grid-cols-3 md:place-items-stretch">
        {menuItems?.map(({title, links}, menuIndex) => {
          return (
            <li key={menuIndex}>
              <h3 className="mb-4 text-xl tracking-wide text-white">{title}</h3>

              <ul className="flex flex-col items-start gap-2">
                {links?.map(({link}, linkIndex) => {
                  return (
                    <li key={linkIndex} className="text-sm">
                      <Link
                        aria-label={link?.text}
                        className="hover-text-underline"
                        to={link?.url}
                        newTab={link?.newTab}
                        type={link?.type}
                      >
                        {link?.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
}

FooterMenu.displayName = 'FooterMenu';
