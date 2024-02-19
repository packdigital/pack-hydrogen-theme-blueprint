import {useMemo} from 'react';
import {useLoaderData, useLocation} from '@remix-run/react';

import type {BlogPage} from '~/lib/types';
import {Container, Pagination} from '~/components';
import type {ContainerSettings} from '~/settings/container';
import {usePagination} from '~/hooks';

import {Schema} from './BlogGrid.schema';
import {BlogGridItem} from './BlogGridItem';

const RESULTS_PER_PAGE = 24;

interface BlogGridCms {
  container: ContainerSettings;
}

export function BlogGrid({cms}: {cms: BlogGridCms}) {
  const {blog} = useLoaderData<{blog: BlogPage}>();
  const {search} = useLocation();

  const categoryParam = useMemo(() => {
    if (!search) return '';
    const params = new URLSearchParams(search);
    return params.get('category')?.toLowerCase().trim() || '';
  }, [search]);

  const filteredArticles = useMemo(() => {
    if (categoryParam) {
      return blog?.articles?.nodes?.filter(({category}) => {
        return (
          category?.toLowerCase().trim() === categoryParam?.toLowerCase().trim()
        );
      });
    }
    return blog?.articles?.nodes;
  }, [blog, categoryParam]);

  const {currentPage, endIndex, setCurrentPage, startIndex} = usePagination({
    resultsPerPage: RESULTS_PER_PAGE,
    resetDependencies: [categoryParam],
    totalResults: filteredArticles?.length,
  });

  return (
    <Container container={cms.container}>
      <div className="px-contained flex flex-col py-8 md:py-10 lg:py-12">
        {filteredArticles?.length ? (
          <ul className="mx-auto grid max-w-[var(--content-max-width)] grid-cols-1 gap-x-5 gap-y-8 xs:grid-cols-2 md:grid-cols-3">
            {filteredArticles.slice(startIndex, endIndex).map((article) => {
              return (
                <li key={article.id}>
                  <BlogGridItem article={article} />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex min-h-[12.5rem] items-center justify-center text-center">
            <p>No posts found under this category.</p>
          </div>
        )}

        {filteredArticles?.length > RESULTS_PER_PAGE && (
          <div className="mt-8 self-center md:mt-10">
            <Pagination
              currentPage={currentPage}
              pageNeighbors={1}
              resultsPerPage={RESULTS_PER_PAGE}
              setCurrentPage={setCurrentPage}
              totalResults={filteredArticles.length}
            />
          </div>
        )}
      </div>
    </Container>
  );
}

BlogGrid.displayName = 'BlogGrid';
BlogGrid.Schema = Schema;
