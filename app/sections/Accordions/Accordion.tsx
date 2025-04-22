import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react';

import {Expand} from '~/components/Expand';
import {RichText} from '~/components/RichText';
import {Svg} from '~/components/Svg';

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
          <DisclosureButton
            aria-label={`${open ? 'Close' : 'Open'} accordion for ${header}`}
            className="flex min-h-16 w-full items-center justify-between gap-x-4 px-4 py-3 text-left xs:px-6"
            style={{backgroundColor: headerBgColor, color: headerTextColor}}
            type="button"
          >
            <h3 className="text-h6 flex-1">{header}</h3>

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
          </DisclosureButton>

          <Expand open={open}>
            <DisclosurePanel className="p-4 xs:px-6" static>
              <RichText>{body}</RichText>
            </DisclosurePanel>
          </Expand>
        </>
      )}
    </Disclosure>
  );
}

Accordion.displayName = 'Accordion';
