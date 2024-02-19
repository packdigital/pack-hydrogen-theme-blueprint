import {Image, Link, Svg} from '~/components';

import type {UseMenuDrawerReturn} from './useMenuDrawer';

type MenuNestedDrawerProps = Pick<
  UseMenuDrawerReturn,
  'handleCloseDrawer' | 'handleNestedDrawer' | 'nestedDrawerContent'
>;

export function MenuNestedDrawer({
  handleCloseDrawer,
  nestedDrawerContent,
  handleNestedDrawer,
}: MenuNestedDrawerProps) {
  const {imageLinks = [], links, mainLink, menuItem} = {...nestedDrawerContent};

  return (
    <div
      className={`scrollbar-hide absolute left-0 top-0 z-[1] h-full w-full bg-background ${
        nestedDrawerContent ? 'visible' : 'invisible'
      }`}
    >
      <div className="scrollbar-hide h-full w-full overflow-y-auto">
        <button
          aria-label="Go back to main menu"
          className="sticky top-0 z-[1] flex h-[3.5rem] w-full items-center justify-between gap-4 border-b border-b-border bg-background p-4"
          onClick={() => handleNestedDrawer(null)}
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
                    onClick={handleCloseDrawer}
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
              onClick={handleCloseDrawer}
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
                      onClick={handleCloseDrawer}
                      type={link?.type}
                    >
                      <Image
                        data={{
                          altText: alt || image?.altText,
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

MenuNestedDrawer.displayName = 'MenuNestedDrawer';
