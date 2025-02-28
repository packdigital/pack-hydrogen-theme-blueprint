import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react';
import type {Metafield} from '@shopify/hydrogen/storefront-api-types';
import startCase from 'lodash/startCase';

import {Expand} from '~/components/Expand';
import {Markdown} from '~/components/Markdown';
import {Svg} from '~/components/Svg';

interface ProductMetafieldsAccordionProps {
  metafield: Metafield;
}

export function ProductMetafieldsAccordion({
  metafield,
}: ProductMetafieldsAccordionProps) {
  const {key, value} = metafield;
  const title = startCase(key);
  const defaultOpen = false;

  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({open}) => (
        <>
          <DisclosureButton
            aria-label={`${open ? 'Close' : 'Open'} accordion for ${title}`}
            className="flex h-14 w-full items-center justify-between gap-x-4 bg-neutralLightest p-4"
            type="button"
          >
            <span className="text-sm font-bold">{title}</span>

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
            <DisclosurePanel
              className="px-4 pt-4 [&_h1]:mb-3 [&_h1]:text-sm [&_h2]:mb-3 [&_h2]:text-sm [&_h3]:mb-3 [&_h3]:text-sm [&_h4]:mb-3 [&_h4]:text-sm [&_h5]:mb-3 [&_h5]:text-sm [&_h6]:mb-3 [&_h6]:text-sm [&_ol]:!pl-4 [&_ol]:text-sm [&_p]:mb-3 [&_p]:text-sm [&_ul]:!pl-4 [&_ul]:text-sm"
              static
            >
              <Markdown>{value}</Markdown>
            </DisclosurePanel>
          </Expand>
        </>
      )}
    </Disclosure>
  );
}

ProductMetafieldsAccordion.displayName = 'ProductMetafieldsAccordion';
