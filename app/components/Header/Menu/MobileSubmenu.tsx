import {Image, Link, Svg} from '~/components';

import type {UseMobileMenuReturn} from '../useMobileMenu';

type MobileSubmenuProps = Pick<
  UseMobileMenuReturn,
  'handleCloseMobileMenu' | 'handleMobileSubmenu' | 'mobileSubmenuContent'
>;

export function MobileSubmenu({
  handleCloseMobileMenu,
  mobileSubmenuContent,
  handleMobileSubmenu,
}: MobileSubmenuProps) {
  const {
    imageLinks = [],
    links,
    mainLink,
    menuItem,
  } = {...mobileSubmenuContent};

  return (
    <div
      className={`scrollbar-hide absolute left-0 top-0 z-[1] size-full bg-background ${
        mobileSubmenuContent ? 'visible' : 'invisible'
      }`}
    >
      <div className="scrollbar-hide size-full overflow-y-auto">
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

          <h3 className="text-nav flex-1 text-left">{menuItem?.text}</h3>
        </button>

        <div className="px-4 pt-5">
          <ul className="mb-8 flex flex-col gap-2">
            {links?.map(({link}, index) => {
              return (
                <li key={index}>
                  <Link
                    aria-label={link?.text}
                    className="hover-text-underline"
                    to={link?.url}
                    newTab={link?.newTab}
                    onClick={handleCloseMobileMenu}
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
              to={mainLink.url}
              newTab={mainLink.newTab}
              onClick={handleCloseMobileMenu}
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
                      to={link?.url}
                      newTab={link?.newTab}
                      onClick={handleCloseMobileMenu}
                      type={link?.type}
                    >
                      <Image
                        data={{
                          altText: image?.altText || alt,
                          url: image?.src,
                          width: image?.width,
                          height: image?.height,
                        }}
                        aspectRatio="16/9"
                        sizes="(min-width: 768px) 400px, 100vw"
                      />

                      <p className="mt-3 text-sm">{caption}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

MobileSubmenu.displayName = 'MobileSubmenu';
