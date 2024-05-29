import {BYOB_SUBNAV_HEIGHT} from './BuildYourOwnBundle';
import type {BYOBSubnavProps} from './BuildYourOwnBundle.types';

export function BYOBSubnav({
  activeTabIndex,
  className = '',
  productGroupings,
  setActiveTabIndex,
}: BYOBSubnavProps) {
  return (
    <nav
      className={`z-[1] w-full overflow-hidden border-b border-border bg-background ${className}`}
    >
      <ul
        className="scrollbar-hide px-contained flex w-full items-center gap-1 overflow-x-auto py-1 md:max-w-[calc(100vw-360px)] xl:max-w-[calc(100vw-480px)]"
        style={{height: `${BYOB_SUBNAV_HEIGHT}px`}}
      >
        {[{subnavName: 'All'}, ...(productGroupings || [])]?.map(
          ({subnavName}, index) => {
            const isActiveTab = activeTabIndex === index;
            return (
              <li key={index}>
                <button
                  className={`text-nav relative z-[1] px-3 py-1 after:absolute after:left-0 after:top-0 after:z-[-1] after:size-full after:origin-center after:rounded-full after:bg-lightGray after:transition ${
                    isActiveTab ? 'after:scale-100' : 'after:scale-0'
                  }`}
                  onClick={() => {
                    setActiveTabIndex(index);
                    const el = document.getElementById('byob-grid-anchor');
                    el?.scrollIntoView({behavior: 'smooth'});
                  }}
                  type="button"
                >
                  {subnavName}
                </button>
              </li>
            );
          },
        )}
      </ul>
    </nav>
  );
}

BYOBSubnav.displayName = 'BYOBSubnav';
