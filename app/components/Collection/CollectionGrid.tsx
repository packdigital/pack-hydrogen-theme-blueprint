import {Pagination} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import {ProductItem} from 'modules/brilliant/ProductItem/ProductItem';
import {Fragment, memo, useMemo} from 'react';

import type {CollectionGridProps} from './Collection.types';
import {useCollectionFilters} from './CollectionFilters';
import {CollectionPromoTile} from './CollectionPromoTile';

import {LoadingDots} from '~/components/Animations';

export const CollectionGrid = memo(
  ({
    desktopFiltersOpen,
    products,
    promoTiles,
    searchTerm,
    settings,
    swatchesMap,
  }: CollectionGridProps) => {
    const {activeFilterValues} = useCollectionFilters();
    const {pagination, productItem: itemSettings} = {...settings};
    const {loadPreviousText = '↑ Load Previous', loadMoreText = 'Load More ↓'} =
      {
        ...pagination,
      };

    const connection = useMemo(() => {
      return products;
    }, [products]);

    const promoTilesByPosition = useMemo(() => {
      return promoTiles?.reduce(
        (acc, tile) => {
          acc[tile.position] = tile;
          return acc;
        },
        {} as Record<number, (typeof promoTiles)[0]>,
      );
    }, [promoTiles]);

    return (
      <Pagination connection={connection}>
        {({nodes, isLoading, PreviousLink, NextLink}) => {
          const productNodes = nodes as Product[];
          return (
            <div className="flex flex-col gap-4">
              <PreviousLink
                className={`btn-select relative self-center`}
                suppressHydrationWarning
              >
                <span className={`${isLoading ? 'invisible' : 'visible'}`}>
                  {loadPreviousText}
                </span>

                {isLoading && (
                  <LoadingDots
                    status="Loading previous products"
                    withAbsolutePosition
                    withStatusRole
                  />
                )}
              </PreviousLink>

              <ul
                className={`mx-auto grid w-full grid-cols-2 gap-x-4 gap-y-8 px-4 xs:gap-x-5 ${
                  desktopFiltersOpen
                    ? 'md:grid-cols-2 lg:grid-cols-3'
                    : 'md:grid-cols-3 lg:grid-cols-4'
                } md:px-0`}
              >
                {productNodes.map((product, index) => {
                  const promoTile = promoTilesByPosition?.[index + 1];
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
                className={`btn-select relative flex self-center`}
                suppressHydrationWarning
              >
                <span className={`${isLoading ? 'invisible' : 'visible'}`}>
                  {loadMoreText}
                </span>

                {isLoading && (
                  <LoadingDots
                    status="Loading more products"
                    withAbsolutePosition
                    withStatusRole
                  />
                )}
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
  },
);

CollectionGrid.displayName = 'CollectionGrid';
