import clsx from 'clsx';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';
import type {Settings} from '~/lib/types';

import type {UseMobileMenuReturn} from '../useMobileMenu';

type MobileSubmenuProps = Pick<
  UseMobileMenuReturn,
  'handleCloseMobileMenu' | 'handleMobileSubmenu' | 'mobileSubmenuIndex'
> & {
  activeSubmenuHasContent: boolean;
  navItems: Settings['header']['menu']['navItems'];
};

export function MobileSubmenu({
  activeSubmenuHasContent,
  handleCloseMobileMenu,
  handleMobileSubmenu,
  mobileSubmenuIndex,
  navItems,
}: MobileSubmenuProps) {
  return (
    <div
      className={clsx(
        'scrollbar-hide absolute left-0 top-0 z-[1] size-full bg-background',
        activeSubmenuHasContent ? 'visible' : 'invisible',
      )}
    >
      {navItems?.map(({imageLinks, links, mainLink, navItem}, index) => {
        const isActiveSubmenu = mobileSubmenuIndex === index;
        const hasContent =
          imageLinks?.length > 0 || links?.length > 0 || mainLink?.text;
        if (!hasContent) return null;

        return (
          <nav
            className={clsx(
              'scrollbar-hide size-full overflow-y-auto',
              !isActiveSubmenu && 'hidden',
            )}
            inert={!isActiveSubmenu}
            key={index}
          >
            <button
              aria-label="Go back to main menu"
              className="sticky top-0 z-[1] flex h-14 w-full items-center justify-between gap-4 border-b border-b-border bg-background p-4"
              onClick={() => handleMobileSubmenu(null)}
              type="button"
            >
              <Svg
                className="w-5"
                src="/svgs/arrow-left.svg#arrow-left"
                title="Arrow Left"
                viewBox="0 0 24 24"
              />

              <h3 className="text-nav flex-1 text-left">{navItem?.text}</h3>
            </button>

            <div className="px-4 pt-5">
              <ul className="mb-8 flex flex-col gap-2">
                {links?.map(({link}, index) => {
                  return (
                    <li key={index}>
                      <Link
                        aria-label={link?.text}
                        className="hover-text-underline"
                        newTab={link?.newTab}
                        onClick={handleCloseMobileMenu}
                        to={link?.url}
                        type={link?.type}
                      >
                        {link?.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {mainLink?.text && (
                <Link
                  aria-label={mainLink.text}
                  className="btn-primary mb-8"
                  newTab={mainLink.newTab}
                  onClick={handleCloseMobileMenu}
                  to={mainLink.url}
                  type={mainLink.type}
                >
                  {mainLink.text}
                </Link>
              )}

              {imageLinks?.length > 0 && (
                <ul className="mb-8 flex flex-col gap-5">
                  {imageLinks.map(({alt, caption, image, link}, index) => {
                    return (
                      <li key={index}>
                        <Link
                          aria-label={caption}
                          newTab={link?.newTab}
                          onClick={handleCloseMobileMenu}
                          to={link?.url}
                          type={link?.type}
                        >
                          {isActiveSubmenu && (
                            <Image
                              data={{
                                altText: image?.altText || alt,
                                url: image?.url,
                                width: image?.width,
                                height: image?.height,
                              }}
                              aspectRatio="16/9"
                              sizes="(min-width: 768px) 400px, 100vw"
                            />
                          )}

                          <p className="mt-3 text-sm">{caption}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </nav>
        );
      })}
    </div>
  );
}

MobileSubmenu.displayName = 'MobileSubmenu';
