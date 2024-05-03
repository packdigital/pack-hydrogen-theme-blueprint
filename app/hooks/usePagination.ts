import {useEffect, useMemo, useState} from 'react';
import {useLocation} from '@remix-run/react';

import {useLocale} from '~/hooks';

/**
 * Create pagination for a list of items
 * @param resultsPerPage - Number of results per page
 * @param resetDependencies - Array of dependencies to reset the current page
 * @param totalResults - Total number of results
 * @returns object with current page, start index, end index and setCurrentPage function
 * @example
 * ```js
 * const {currentPage, startIndex, endIndex, setCurrentPage} = usePagination({
 *  resultsPerPage: 24,
 * resetDependencies: [search],
 * totalResults: 100,
 * });
 * ```
 */

interface UsePaginationProps {
  resultsPerPage?: number;
  resetDependencies?: any[];
  totalResults: number | undefined;
}

interface UsePaginationReturn {
  currentPage: number;
  endIndex: number;
  setCurrentPage: (page: number) => void;
  startIndex: number;
}

export function usePagination({
  resultsPerPage = 24,
  resetDependencies = [],
  totalResults = 0,
}: UsePaginationProps): UsePaginationReturn {
  const {search} = useLocation();
  const {pathPrefix} = useLocale();

  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pageParam = useMemo(() => {
    if (!search) return 1;
    const params = new URLSearchParams(search);
    return Number(params.get('page')) || 1;
  }, [search]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * resultsPerPage;
  }, [currentPage, resultsPerPage]);

  const endIndex = useMemo(() => {
    return startIndex + resultsPerPage;
  }, [startIndex, resultsPerPage]);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    setCurrentPage(1);
  }, [...resetDependencies]);

  useEffect(() => {
    if (!totalResults || totalResults <= resultsPerPage) return;
    const {origin, pathname, search} = window.location;
    const params = new URLSearchParams(search);
    const currentPageParam = params.get('page');

    if (currentPage === Number(currentPageParam)) return;

    params.set('page', `${currentPage}`);
    const updatedUrl = `${origin}${pathPrefix}${pathname}?${params}`;
    window.history.replaceState(window.history.state, '', updatedUrl);
  }, [currentPage, totalResults]);

  return {
    currentPage,
    endIndex,
    setCurrentPage,
    startIndex,
  };
}
