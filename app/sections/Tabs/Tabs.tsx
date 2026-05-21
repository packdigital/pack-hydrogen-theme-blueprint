import {useState} from 'react';
import clsx from 'clsx';
import {RenderSection} from '@pack/react';

import {Container} from '~/components/Container';

import type {TabsCms} from './Tabs.types';
import {Schema} from './Tabs.schema';

export function Tabs({cms}: {cms: TabsCms}) {
  const {heading, tabs} = cms;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!tabs?.length) return null;

  const activeTab = tabs[activeIndex];

  return (
    <Container container={cms.container}>
      <div className="px-contained my-4 md:my-8 xl:my-12">
        <div className="mx-auto flex max-w-[60rem] flex-col gap-4">
          {!!heading && <h2 className="text-h2">{heading}</h2>}

          <div
            role="tablist"
            className="flex flex-wrap gap-1 border-b border-border"
          >
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabs-panel-${index}`}
                  id={`tabs-tab-${index}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  className={clsx(
                    '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-text text-text'
                      : 'border-transparent text-text/60 hover:text-text',
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`tabs-panel-${activeIndex}`}
            aria-labelledby={`tabs-tab-${activeIndex}`}
            className="flex flex-col gap-4 pt-4"
          >
            {activeTab?.content?.map((block, index) => (
              // Each block is a resolved nested-section node carrying its
              // own `_template`, identity, styles, and field values. Let
              // `RenderSection` look it up against the section registry.
              <RenderSection
                key={block.id ?? block.clientId ?? index}
                section={block}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

Tabs.displayName = 'Tabs';
Tabs.Schema = Schema;
