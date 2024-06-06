import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react';

import type {Settings} from '~/lib/types';
import {Link, Svg} from '~/components';

export function MobileMenuItem({
  item,
}: {
  item: Settings['footer']['menu']['menuItems'][number];
}) {
  return (
    <Disclosure as="div" className="border-b border-b-gray">
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
              className={`w-4 text-white ${open ? 'rotate-180' : ''}`}
              src="/svgs/chevron-down.svg#chevron-down"
              title="Chevron"
              viewBox="0 0 24 24"
            />
          </DisclosureButton>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-97 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-97 opacity-0"
          >
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
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

MobileMenuItem.displayName = 'MobileMenuItem';
