import {Svg} from '~/components';

interface CollectionFiltersButtonProps {
  desktopFiltersOpen: boolean;
  setDesktopFiltersOpen: (value: boolean) => void;
  setMobileFiltersOpen: (value: boolean) => void;
}

export function CollectionFiltersButton({
  desktopFiltersOpen,
  setDesktopFiltersOpen,
  setMobileFiltersOpen,
}: CollectionFiltersButtonProps) {
  return (
    <div className="w-full">
      <button
        aria-label={`${desktopFiltersOpen ? 'Hide' : 'Show'} filters drawer`}
        className="btn-pill flex items-center gap-2 max-md:hidden"
        onClick={() => setDesktopFiltersOpen(!desktopFiltersOpen)}
        type="button"
      >
        <Svg
          className="w-4 text-text"
          src="/svgs/filter.svg#filter"
          title="Filter"
          viewBox="0 0 24 24"
        />
        Filters
      </button>

      {/* mobile */}
      <button
        aria-label="Open filters drawer"
        className="flex h-14 w-full items-center gap-2 rounded-none border-x-0 border-y border-r border-border pl-4 pr-2.5 md:hidden"
        onClick={() => setMobileFiltersOpen(true)}
        type="button"
      >
        <Svg
          className="w-4 text-current"
          src="/svgs/filter.svg#filter"
          title="Filter"
          viewBox="0 0 24 24"
        />
        <div className="flex flex-1 items-center gap-2 overflow-hidden text-left xs:gap-3">
          <span className="text-nav">Filters</span>
        </div>
      </button>
    </div>
  );
}

CollectionFiltersButton.displayName = 'CollectionFiltersButton';
