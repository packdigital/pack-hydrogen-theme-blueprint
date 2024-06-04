import {useCallback} from 'react';
import {useSearchParams} from '@remix-run/react';

import {Container} from '~/components';
import type {ContainerSettings} from '~/settings/container';

import {Schema} from './BlogCategories.schema';

interface BlogCategoriesCms {
  categories: string[];
  container: ContainerSettings;
}

export function BlogCategories({cms}: {cms: BlogCategoriesCms}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')?.toLowerCase().trim();

  const {categories} = cms;

  const handleCategoryClick = useCallback(
    (category: string) => {
      if (category === categoryParam) return;
      if (!categoryParam && category === 'all') return;
      const newParams = new URLSearchParams(searchParams);
      if (category === 'all') {
        newParams.set('category', '');
        setSearchParams(newParams);
      } else {
        newParams.set('category', category);
        setSearchParams(newParams);
      }
    },
    [categoryParam, searchParams],
  );

  return (
    <Container container={cms.container}>
      <div className="px-contained scrollbar-hide flex overflow-x-auto overflow-y-hidden pt-4 xs:justify-center">
        <ul className="flex justify-center gap-2 xs:flex-wrap">
          {['All', ...(categories || [])].map((item, index) => {
            const category = item.toLowerCase().trim();
            let isActive = false;
            if (categoryParam) {
              isActive = categoryParam === category;
            } else {
              isActive = category === 'all';
            }
            return (
              <li key={index}>
                <button
                  className={`btn-text flex h-8 items-center justify-center rounded-full px-4 transition ${
                    isActive ? 'bg-black text-white' : 'bg-lightGray text-text'
                  }`}
                  onClick={() => handleCategoryClick(category)}
                  type="button"
                >
                  {category}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Container>
  );
}

BlogCategories.displayName = 'BlogCategories';
BlogCategories.Schema = Schema;
