import {Fragment, useMemo} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {Pagination} from '@shopify/hydrogen';

import {LoadingDots, ProductItem} from '~/components';

import type {CollectionGridProps} from './Collection.types';
import {CollectionPromoTile} from './CollectionPromoTile';
import {useCollectionFilters} from './CollectionFilters';

export function CollectionGrid({
  desktopFiltersOpen,
  isSearchResults,
  products,
  promoTiles,
  searchTerm,
  settings,
  swatchesMap,
}: CollectionGridProps) {
  const {activeFilterValues} = useCollectionFilters();
  const {pagination, productItem: itemSettings} = {...settings};
  const {loadPreviousText = '↑ Load Previous', loadMoreText = 'Load More ↓'} = {
    ...pagination,
  };

  const connection = useMemo(() => {
    return products;
  }, [JSON.stringify(products.pageInfo)]);

  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const productNodes = nodes as Product[];
        return (
          <div className="flex flex-col gap-4">
            <PreviousLink
              className={`btn-pill relative self-center`}
              suppressHydrationWarning
            >
              {isLoading && (
                <LoadingDots
                  status="Loading previous products"
                  withAbsolutePosition
                  withStatusRole
                />
              )}
              <span className={`${isLoading ? 'invisible' : 'visible'}`}>
                {loadPreviousText}
              </span>
            </PreviousLink>

            <ul
              className={`mx-auto grid w-full grid-cols-2 gap-x-4 gap-y-8 px-4 xs:gap-x-5 ${
                desktopFiltersOpen
                  ? 'md:grid-cols-2 lg:grid-cols-3'
                  : 'md:grid-cols-3 lg:grid-cols-4'
              } md:px-0`}
            >
              {productNodes.map((product, index) => {
                const promoTile = promoTiles?.find(
                  ({position}) => position === index + 1,
                );
                return (
                  <Fragment key={product.id}>
                    {promoTile && (
                      <li>
                        <CollectionPromoTile tile={promoTile} />
                      </li>
                    )}
                    <li>
                      <ProductItem
                        enabledColorNameOnHover={
                          itemSettings?.enabledColorNameOnHover
                        }
                        enabledColorSelector={
                          itemSettings?.enabledColorSelector
                        }
                        enabledQuickShop={itemSettings?.enabledQuickShop}
                        enabledStarRating={itemSettings?.enabledStarRating}
                        handle={product.handle}
                        index={index}
                        isSearchResults={isSearchResults}
                        product={product}
                        priority={index < 8}
                        quickShopMobileHidden={
                          itemSettings?.quickShopMobileHidden
                        }
                        searchTerm={searchTerm}
                        swatchesMap={swatchesMap}
                      />
                    </li>
                  </Fragment>
                );
              })}
            </ul>

            <NextLink
              className={`btn-pill relative flex self-center`}
              suppressHydrationWarning
            >
              {isLoading && (
                <LoadingDots
                  status="Loading more products"
                  withAbsolutePosition
                  withStatusRole
                />
              )}
              <span className={`${isLoading ? 'invisible' : 'visible'}`}>
                {loadMoreText}
              </span>
            </NextLink>

            {!products?.nodes?.length && activeFilterValues?.length > 0 && (
              <div className="flex min-h-48 items-center justify-center text-center">
                <p>No products found matching these filters.</p>
              </div>
            )}
          </div>
        );
      }}
    </Pagination>
  );
}

CollectionGrid.displayName = 'CollectionGrid';
