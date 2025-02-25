import {Svg} from '~/components/Svg';

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
      {/* desktop */}
      <button
        aria-label={`${desktopFiltersOpen ? 'Hide' : 'Show'} filters drawer`}
        className="btn-select flex items-center gap-2 max-md:hidden"
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
        className="btn-select flex w-full items-center justify-start gap-2 pl-4 pr-2.5 md:hidden"
        onClick={() => setMobileFiltersOpen(true)}
        type="button"
      >
        <Svg
          className="w-4 text-current"
          src="/svgs/filter.svg#filter"
          title="Filter"
          viewBox="0 0 24 24"
        />
        Filters
      </button>
    </div>
  );
}

CollectionFiltersButton.displayName = 'CollectionFiltersButton';
