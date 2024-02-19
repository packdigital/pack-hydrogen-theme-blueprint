import {Disclosure, Transition} from '@headlessui/react';

import {Markdown, Svg} from '~/components';

import type {AccordionProps} from './Accordions.types';

export function Accordion({
  accordion,
  headerBgColor,
  headerTextColor,
}: AccordionProps) {
  const {body, defaultOpen, header} = accordion;

  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({open}) => (
        <>
          <Disclosure.Button
            aria-label={`${open ? 'Close' : 'Open'} accordion for ${header}`}
            className="flex min-h-[4rem] w-full items-center justify-between gap-x-4 px-4 py-3 text-left xs:px-6"
            style={{backgroundColor: headerBgColor, color: headerTextColor}}
            type="button"
          >
            <h3 className="text-title-h6 flex-1">{header}</h3>

            {open ? (
              <Svg
                className="w-4 text-current"
                src="/svgs/minus.svg#minus"
                title="Minus"
                viewBox="0 0 24 24"
              />
            ) : (
              <Svg
                className="w-4 text-current"
                src="/svgs/plus.svg#plus"
                title="Plus"
                viewBox="0 0 24 24"
              />
            )}
          </Disclosure.Button>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-97 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-97 opacity-0"
          >
            <Disclosure.Panel className="px-4 py-4 xs:px-6" static>
              <Markdown>{body}</Markdown>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

Accordion.displayName = 'Accordion';
