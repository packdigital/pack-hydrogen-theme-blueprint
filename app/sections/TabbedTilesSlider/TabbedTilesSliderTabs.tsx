import {Tab, TabList} from '@headlessui/react';
import clsx from 'clsx';

import type {TabbedTilesSliderTabsProps} from './TabbedTilesSlider.types';

export function TabbedTilesSliderTabs({
  activeTabIndex,
  maxWidthClass,
  tabs,
  textColor,
}: TabbedTilesSliderTabsProps) {
  return (
    <div
      className={clsx(
        'mx-auto',
        maxWidthClass,
        'mb-6 flex justify-center border-b border-border md:mb-10',
      )}
    >
      <div className="scrollbar-hide overflow-x-auto overflow-y-hidden px-4">
        <TabList className="flex gap-4 xs:gap-8">
          {tabs?.map((tab, index) => {
            return (
              <Tab
                key={index}
                className={clsx(
                  'text-nav relative flex h-full flex-col whitespace-nowrap pb-3 before:absolute before:bottom-0 before:z-[1] before:w-full before:origin-center before:border-b-2 before:border-current before:transition max-xs:pb-2 max-xs:text-xs',
                  activeTabIndex === index
                    ? 'before:scale-100'
                    : 'before:scale-0',
                )}
                style={{color: textColor}}
              >
                {tab.tabName}
              </Tab>
            );
          })}
        </TabList>
      </div>
    </div>
  );
}

TabbedTilesSliderTabs.displayName = 'TabbedTilesSliderTabs';
