import {Image, Link} from '~/components';

import type {UseDesktopMenuReturn} from '../useDesktopMenu';

type DesktopMenuProps = Pick<
  UseDesktopMenuReturn,
  | 'handleDesktopMenuClose'
  | 'handleDesktopMenuStayOpen'
  | 'handleDesktopMenuHoverOut'
  | 'desktopMenuContent'
>;

export function DesktopMenu({
  handleDesktopMenuClose,
  handleDesktopMenuStayOpen,
  handleDesktopMenuHoverOut,
  desktopMenuContent,
}: DesktopMenuProps) {
  const {imageLinks = [], links = [], mainLink} = {...desktopMenuContent};
  const hasContent = imageLinks?.length > 0 || links?.length > 0;

  return (
    <div
      className={`absolute left-0 top-full hidden w-full origin-top border-border bg-background transition duration-200 lg:block ${
        hasContent ? 'scale-y-100 border-b' : 'scale-y-0'
      }`}
      onMouseEnter={handleDesktopMenuStayOpen}
      onMouseLeave={handleDesktopMenuHoverOut}
    >
      {hasContent && (
        <div className="mx-auto grid max-w-[70rem] grid-cols-[12rem_1fr] gap-5 p-8 md:p-12">
          <div>
            <ul className="flex flex-col gap-2">
              {links?.map(({link}, index) => {
                return (
                  <li key={index}>
                    <Link
                      aria-hidden={!hasContent}
                      aria-label={link?.text}
                      className="hover-text-underline"
                      to={link?.url}
                      newTab={link?.newTab}
                      onClick={handleDesktopMenuClose}
                      tabIndex={hasContent ? 0 : -1}
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
                aria-hidden={!hasContent}
                aria-label={mainLink.text}
                className="btn-primary mt-5"
                to={mainLink.url}
                newTab={mainLink.newTab}
                onClick={handleDesktopMenuClose}
                tabIndex={hasContent ? 0 : -1}
                type={mainLink.type}
              >
                {mainLink.text}
              </Link>
            )}
          </div>

          <ul className="grid grid-cols-2 gap-5">
            {imageLinks?.map(({alt, caption, image, link}, index) => {
              return (
                <li key={index}>
                  <Link
                    aria-hidden={!hasContent}
                    aria-label={caption}
                    to={link?.url}
                    newTab={link?.newTab}
                    onClick={handleDesktopMenuClose}
                    tabIndex={hasContent ? 0 : -1}
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
                      width="400"
                      isStatic
                    />

                    <p className="mt-3 text-sm">{caption}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

DesktopMenu.displayName = 'DesktopMenu';
