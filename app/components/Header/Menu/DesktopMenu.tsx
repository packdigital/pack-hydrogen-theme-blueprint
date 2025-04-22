import {memo} from 'react';
import clsx from 'clsx';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {useSettings} from '~/hooks';

import type {UseDesktopMenuReturn} from '../useDesktopMenu';

type DesktopMenuProps = Pick<
  UseDesktopMenuReturn,
  | 'desktopMenuIndex'
  | 'handleDesktopMenuClose'
  | 'handleDesktopMenuHoverOut'
  | 'handleDesktopMenuStayOpen'
>;

export const DesktopMenu = memo(
  ({
    desktopMenuIndex,
    handleDesktopMenuClose,
    handleDesktopMenuHoverOut,
    handleDesktopMenuStayOpen,
  }: DesktopMenuProps) => {
    const {header} = useSettings();
    const {navItems} = {...header?.menu};
    const activeMenu =
      typeof desktopMenuIndex === 'number'
        ? navItems?.[desktopMenuIndex]
        : null;
    const activeMenuHasContent = Boolean(
      activeMenu &&
        (activeMenu.imageLinks?.length > 0 ||
          activeMenu.links?.length > 0 ||
          !!activeMenu.mainLink?.text),
    );

    return (
      <div
        data-comp={DesktopMenu.displayName}
        className={clsx(
          'absolute left-0 top-full hidden w-full origin-top border-border bg-background transition duration-200 lg:block',
          activeMenuHasContent ? 'scale-y-100 border-b' : 'scale-y-0',
        )}
        onMouseEnter={handleDesktopMenuStayOpen}
        onMouseLeave={handleDesktopMenuHoverOut}
      >
        {navItems?.map(({imageLinks, links, mainLink}, index) => {
          const isActiveMenu = desktopMenuIndex === index;
          const hasContent =
            imageLinks?.length > 0 || links?.length > 0 || mainLink?.text;
          if (!hasContent) return null;

          return (
            <nav
              key={index}
              inert={!isActiveMenu}
              className={clsx(
                'mx-auto grid max-w-[70rem] grid-cols-[12rem_1fr] gap-5 p-8 md:p-12',
                !isActiveMenu && 'hidden',
              )}
            >
              <div>
                <ul className="flex flex-col gap-2">
                  {links?.map(({link}, index) => {
                    return (
                      <li key={index}>
                        <Link
                          aria-label={link?.text}
                          className="hover-text-underline"
                          newTab={link?.newTab}
                          onClick={handleDesktopMenuClose}
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
                    className="btn-primary mt-5"
                    newTab={mainLink.newTab}
                    onClick={handleDesktopMenuClose}
                    to={mainLink.url}
                    type={mainLink.type}
                  >
                    {mainLink.text}
                  </Link>
                )}
              </div>

              {imageLinks?.length > 0 && (
                <ul className="grid grid-cols-2 gap-5">
                  {imageLinks.map(({alt, caption, image, link}, index) => {
                    return (
                      <li key={index}>
                        <Link
                          aria-label={caption}
                          newTab={link?.newTab}
                          onClick={handleDesktopMenuClose}
                          to={link?.url}
                          type={link?.type}
                        >
                          {isActiveMenu && (
                            <Image
                              data={{
                                altText: image?.altText || alt,
                                url: image?.url,
                                width: image?.width,
                                height: image?.height,
                              }}
                              aspectRatio="16/9"
                              width="400px"
                            />
                          )}

                          <p className="mt-3 text-sm">{caption}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </nav>
          );
        })}
      </div>
    );
  },
);

DesktopMenu.displayName = 'DesktopMenu';
