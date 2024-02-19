import type {PaginationProps} from './usePaginationLayout';
import {usePaginationLayout} from './usePaginationLayout';

export function Pagination({
  currentPage = 1,
  pageNeighbors = 1,
  resultsPerPage = 24,
  setCurrentPage,
  totalResults = 0,
  withScrollToTop = false,
}: PaginationProps) {
  const {
    pages,
    handlePageClick,
    handlePrevClick,
    handleNextClick,
    handlePrevSpillClick,
    handleNextSpillClick,
  } = usePaginationLayout({
    currentPage,
    pageNeighbors,
    resultsPerPage,
    setCurrentPage,
    totalResults,
    withScrollToTop,
  });

  return (
    <ul className="flex gap-2">
      <li>
        <button
          aria-label="Go to previous page"
          className="disabled:opacity-50"
          disabled={currentPage === pages[0]}
          onClick={handlePrevClick}
          type="button"
        >
          Prev
        </button>
      </li>

      {pages.map((page, index) => {
        const isActivePage = currentPage === page;
        return (
          <li key={index}>
            {page === 'right' || page === 'left' ? (
              <button
                aria-label={`Jump to more ${
                  page === 'right' ? 'previous' : 'next'
                } pages`}
                onClick={
                  page === 'right' ? handlePrevSpillClick : handleNextSpillClick
                }
                type="button"
              >
                ...
              </button>
            ) : (
              <button
                aria-label={`Go to page ${page}`}
                className={`${
                  isActivePage ? 'underline underline-offset-2' : ''
                }`}
                onClick={() => handlePageClick(page)}
                type="button"
              >
                {page}
              </button>
            )}
          </li>
        );
      })}

      <li>
        <button
          aria-label="Go to previous page"
          className="disabled:opacity-50"
          disabled={currentPage === pages[pages.length - 1]}
          onClick={handleNextClick}
          type="button"
        >
          Next
        </button>
      </li>
    </ul>
  );
}

Pagination.displayName = 'Pagination';
