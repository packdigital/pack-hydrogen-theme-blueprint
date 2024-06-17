import {Fragment, useState} from 'react';
import {TabGroup, TabPanels, TabPanel} from '@headlessui/react';

import {Container, Link, TilesSlider} from '~/components';

import {Schema} from './TabbedTilesSlider.schema';
import {TabbedTilesSliderTabs} from './TabbedTilesSliderTabs';
import type {TabbedTilesSliderCms} from './TabbedTilesSlider.types';

export function TabbedTilesSlider({cms}: {cms: TabbedTilesSliderCms}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const {button, header, section, tabs} = cms;
  const {
    heading,
    subheading,
    alignment = 'text-center items-center',
  } = {...header};
  const {
    aspectRatio,
    buttonStyle = 'btn-primary',
    fullWidth,
    textAlign,
    textColor = 'var(--text)',
    tileHeadingSize,
    tilesPerViewDesktop,
    tilesPerViewMobile,
    tilesPerViewTablet,
  } = {...section};
  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div className="lg:px-contained py-contained overflow-x-clip">
        {(!!heading || !!subheading) && (
          <div
            className={`max-lg:px-contained mx-auto mb-6 flex w-full flex-col gap-2 md:mb-10 ${alignment} ${maxWidthClass}`}
            style={{color: textColor}}
          >
            {heading && <h2 className="text-h2">{heading}</h2>}
            {subheading && <span className="text-body-lg">{subheading}</span>}
          </div>
        )}

        <TabGroup
          as="div"
          className="mx-auto"
          selectedIndex={activeTabIndex}
          onChange={setActiveTabIndex}
        >
          <TabbedTilesSliderTabs
            activeTabIndex={activeTabIndex}
            maxWidthClass={maxWidthClass}
            tabs={tabs}
            textColor={textColor}
          />

          <TabPanels as={Fragment}>
            {tabs?.length > 0 &&
              tabs.map(({tiles}, index) => {
                return (
                  <TabPanel as={Fragment} key={index}>
                    <TilesSlider
                      aspectRatio={aspectRatio}
                      maxWidthClass={maxWidthClass}
                      textAlign={textAlign}
                      textColor={textColor}
                      tileHeadingSize={tileHeadingSize}
                      tiles={tiles}
                      tilesPerViewDesktop={tilesPerViewDesktop}
                      tilesPerViewMobile={tilesPerViewMobile}
                      tilesPerViewTablet={tilesPerViewTablet}
                    />
                  </TabPanel>
                );
              })}
          </TabPanels>
        </TabGroup>

        {button?.text && (
          <div className={`mt-10 flex w-full flex-col ${alignment}`}>
            <Link
              aria-label={button.text}
              className={`${buttonStyle}`}
              to={button.url}
              newTab={button.newTab}
              type={button.type}
            >
              {button.text}
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}

TabbedTilesSlider.displayName = 'TabbedTilesSlider';
TabbedTilesSlider.Schema = Schema;
