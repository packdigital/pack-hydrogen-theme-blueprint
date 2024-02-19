import {useCallback, useEffect, useMemo} from 'react';

const LEFT_PAGE = 'left';
const RIGHT_PAGE = 'right';

const range = (from: number, to: number, step = 1) => {
  let i = from;
  const pool = [];

  while (i <= to) {
    pool.push(i);
    i += step;
  }

  return pool;
};

export interface PaginationProps {
  currentPage: number;
  pageNeighbors?: 1 | 2;
  resultsPerPage?: number;
  setCurrentPage: (page: number) => void;
  totalResults: number;
  withScrollToTop?: boolean;
}

interface UsePaginationLayoutReturn {
  pages: (number | string)[];
  handlePageClick: (page: number | string) => void;
  handlePrevClick: () => void;
  handleNextClick: () => void;
  handlePrevSpillClick: () => void;
  handleNextSpillClick: () => void;
}

export function usePaginationLayout({
  currentPage = 1,
  pageNeighbors = 1,
  resultsPerPage = 24,
  setCurrentPage,
  totalResults = 0,
  withScrollToTop = false,
}: PaginationProps): UsePaginationLayoutReturn {
  const totalPages = useMemo(
    () => Math.ceil(totalResults / resultsPerPage),
    [totalResults, resultsPerPage],
  );

  const gotoPage = useCallback(
    (page: number) => {
      const currentPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(currentPage);
    },
    [totalPages, resultsPerPage],
  );

  useEffect(() => {
    gotoPage(currentPage || 1);
  }, [gotoPage, currentPage]);

  const handlePageClick = useCallback((page: number | string) => {
    if (typeof page === 'string') return;
    gotoPage(page);
    if (withScrollToTop) window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

  const handlePrevClick = useCallback(() => {
    gotoPage(currentPage - 1);
    if (withScrollToTop) window.scrollTo({top: 0, behavior: 'smooth'});
  }, [currentPage]);

  const handleNextClick = useCallback(() => {
    gotoPage(currentPage + 1);
    if (withScrollToTop) window.scrollTo({top: 0, behavior: 'smooth'});
  }, [currentPage, pageNeighbors]);

  const handlePrevSpillClick = useCallback(() => {
    gotoPage(currentPage - pageNeighbors * 2 - 1);
    if (withScrollToTop) window.scrollTo({top: 0, behavior: 'smooth'});
  }, [currentPage]);

  const handleNextSpillClick = useCallback(() => {
    gotoPage(currentPage + pageNeighbors * 2 + 1);
    if (withScrollToTop) window.scrollTo({top: 0, behavior: 'smooth'});
  }, [currentPage, pageNeighbors]);

  const fetchPageNumbers = useCallback(() => {
    const totalNumbers = pageNeighbors * 2 + 3; // Neigbors on both sides including first, middle and last
    const totalBlocks = totalNumbers + 2; // including left and right buttons

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currentPage - pageNeighbors;
      const rightBound = currentPage + pageNeighbors;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  }, [totalPages, currentPage, pageNeighbors]);

  let pages: (number | string)[] = [];
  if (totalResults && totalPages > 1) {
    pages = fetchPageNumbers();
  }

  return {
    pages,
    handlePageClick,
    handlePrevClick,
    handleNextClick,
    handlePrevSpillClick,
    handleNextSpillClick,
  };
}
