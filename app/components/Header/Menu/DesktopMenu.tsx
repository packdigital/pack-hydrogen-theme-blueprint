import {memo} from 'react';
import clsx from 'clsx';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';

import type {UseDesktopMenuReturn} from '../useDesktopMenu';

import {desktopMenuHasContent} from './desktopMenu.utils';
import type {DesktopMenuItem} from './desktopMenu.utils';

type DesktopMenuProps = Pick<
  UseDesktopMenuReturn,
  | 'handleDesktopMenuClose'
  | 'handleDesktopMenuHoverOut'
  | 'handleDesktopMenuStayOpen'
> & {
  /** Another item's menu is open: hide this one instantly, don't animate */
  anotherMenuOpen: boolean;
  id: string;
  isActiveMenu: boolean;
  item: DesktopMenuItem;
};

/**
 * The dropdown panel for one top-level nav item. It is rendered inside that
 * item's <li>, directly after its trigger, so keyboard focus moves from the
 * trigger into the panel in DOM order (WCAG 2.4.3). Closed panels are inert.
 */
export const DesktopMenu = memo(
  ({
    anotherMenuOpen,
    handleDesktopMenuClose,
    handleDesktopMenuHoverOut,
    handleDesktopMenuStayOpen,
    id,
    isActiveMenu,
    item,
  }: DesktopMenuProps) => {
    const {imageLinks, links, mainLink, navItem} = item;

    if (!desktopMenuHasContent(item)) return null;

    return (
      <div
        data-comp={DesktopMenu.displayName}
        className={clsx(
          'absolute left-0 top-full hidden w-full origin-top border-border bg-background transition-[transform,visibility] lg:block',
          isActiveMenu ? 'visible scale-y-100 border-b' : 'invisible scale-y-0',
          anotherMenuOpen ? 'duration-0' : 'duration-200',
        )}
        id={id}
        inert={!isActiveMenu}
        onMouseEnter={handleDesktopMenuStayOpen}
        onMouseLeave={handleDesktopMenuHoverOut}
      >
        <div className="mx-auto grid max-w-[70rem] grid-cols-[12rem_1fr] gap-5 p-8 md:p-12">
          <div>
            <ul
              aria-label={navItem?.text}
              className="flex flex-col gap-2 text-text"
            >
              {links?.map(({link}, index) => {
                return (
                  <li key={index}>
                    <Link
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
            <ul className="grid grid-cols-2 gap-5 text-text">
              {imageLinks.map(({alt, caption, image, link}, index) => {
                return (
                  <li key={index}>
                    <Link
                      newTab={link?.newTab}
                      onClick={handleDesktopMenuClose}
                      to={link?.url}
                      type={link?.type}
                    >
                      {isActiveMenu && (
                        <Image
                          data={{
                            // The caption names the link; the image is
                            // decorative unless it has its own alt text
                            altText: image?.altText || alt || '',
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
        </div>
      </div>
    );
  },
);

DesktopMenu.displayName = 'DesktopMenu';
