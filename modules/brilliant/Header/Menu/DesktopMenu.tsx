import {ChevronRightSquare} from 'lucide-react';
import {memo} from 'react';

import type {UseDesktopMenuReturn} from '../useDesktopMenu';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {Card, CardContent} from '~/components/ui/card';
import {useSettings} from '~/hooks';

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
        className={`absolute left-0 top-full hidden w-full origin-top border-b border-primary bg-background transition duration-200 lg:block ${
          activeMenuHasContent ? 'scale-y-100 border-b' : 'scale-y-0'
        }`}
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
              className={`mx-auto grid grid-cols-[12rem_1fr] gap-5 p-8 md:p-12 ${
                !isActiveMenu ? 'hidden' : ''
              }`}
            >
              <div>
                <h3 className="mb-2">Categories:</h3>
                <ul className="flex flex-col gap-2">
                  {links?.map(({link}, index) => {
                    return (
                      <li
                        key={index}
                        className="flex items-center justify-start"
                      >
                        <ChevronRightSquare className="pr-2" />
                        <Link
                          aria-label={link?.text}
                          className="hover-text-underline"
                          inert={!isActiveMenu}
                          newTab={link?.newTab}
                          onClick={handleDesktopMenuClose}
                          to={link?.url}
                          type={link?.type}
                        >
                          <h4 className="">{link?.text}</h4>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {mainLink?.text && (
                  <Link
                    aria-label={mainLink.text}
                    className="btn-primary mt-5"
                    inert={!isActiveMenu}
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
                <ul className="flex gap-4">
                  {imageLinks.map(({alt, caption, image, link}, index) => {
                    return (
                      <li key={index}>
                        <Card className="p-0">
                          <CardContent className="p-1">
                            <Link
                              aria-label={caption}
                              inert={!isActiveMenu}
                              newTab={link?.newTab}
                              onClick={handleDesktopMenuClose}
                              to={link?.url}
                              type={link?.type}
                            >
                              {isActiveMenu && (
                                <div className="overflow-hidden rounded-lg">
                                  <Image
                                    data={{
                                      altText: image?.altText || alt,
                                      url: image?.url,
                                      width: image?.width,
                                      height: image?.height,
                                    }}
                                    aspectRatio="16/9"
                                    sizes="(max-width: 400px) 100vw, 400px"
                                    className="h-auto w-full"
                                  />
                                </div>
                              )}
                              <div className="items-center justify-center px-2 py-1">
                                <h4 className="mt-2 text-center text-xl font-normal">
                                  {caption}
                                </h4>
                              </div>
                            </Link>
                          </CardContent>
                        </Card>
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
