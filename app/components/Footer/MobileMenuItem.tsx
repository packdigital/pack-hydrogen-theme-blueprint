import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react';
import clsx from 'clsx';

import {Expand} from '~/components/Expand';
import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';
import type {Settings} from '~/lib/types';

export function MobileMenuItem({
  item,
}: {
  item: Settings['footer']['menu']['menuItems'][number];
}) {
  return (
    <Disclosure as="div" className="border-b border-b-neutralLight">
      {({open}) => (
        <>
          <DisclosureButton
            aria-label={
              open ? `Close ${item.title} menu` : `Open ${item.title} menu`
            }
            className="flex h-14 w-full items-center justify-between p-4"
          >
            <h3 className="text-nav">{item.title}</h3>

            <Svg
              className={clsx('w-4 text-white', open && 'rotate-180')}
              src="/svgs/chevron-down.svg#chevron-down"
              title="Chevron"
              viewBox="0 0 24 24"
            />
          </DisclosureButton>

          <Expand open={open}>
            <DisclosurePanel
              as="ul"
              className="flex flex-col items-start gap-2 px-4 pb-6"
              static
            >
              {item.links?.map(({link}, index) => {
                return (
                  <li key={index}>
                    <Link
                      aria-label={link?.text}
                      className="hover-text-underline"
                      to={link?.url}
                      newTab={link?.newTab}
                      tabIndex={open ? 0 : -1}
                      type={link?.type}
                    >
                      {link?.text}
                    </Link>
                  </li>
                );
              })}
            </DisclosurePanel>
          </Expand>
        </>
      )}
    </Disclosure>
  );
}

MobileMenuItem.displayName = 'MobileMenuItem';
