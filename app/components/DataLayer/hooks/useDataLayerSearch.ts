import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from '@remix-run/react';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

import {pathWithoutLocalePrefix} from '~/lib/utils';
import {useGlobal} from '~/hooks';

import {isElevar, mapProductItemProduct, mapProductItemVariant} from './utils';
import type {UserProperties} from './useDataLayerInit';

type SearchProduct = Product & {searchTerm: string};

export function useDataLayerSearch({
  cartReady,
  handleDataLayerEvent,
  userDataEvent,
  userDataEventTriggered,
  userProperties,
}: {
  cartReady: boolean;
  handleDataLayerEvent: (event: Record<string, any>) => void;
  userDataEvent: (arg0: any) => void;
  userDataEventTriggered: boolean;
  userProperties: UserProperties;
}) {
  const pathnameRef = useRef<string | null>(null);
  const location = useLocation();
  const pathname = pathWithoutLocalePrefix(location.pathname);
  const {emitter} = useGlobal();

  const [searchPageResults, setSearchPageResults] = useState<
    SearchProduct[] | null | undefined
  >(null);
  const [searchResults, setSearchResults] = useState<
    SearchProduct[] | null | undefined
  >(null);
  const [clickedSearchResultsItem, setClickedSearchResultsItem] = useState<
    ProductVariant | null | undefined
  >(null);

  const viewSearchResultsEvent = useCallback(
    ({
      results,
      userProperties: _userProperties,
    }: {
      results?: SearchProduct[];
      userProperties: UserProperties;
    }) => {
      if (!results?.length) return;
      const event = {
        event: 'dl_view_search_results',
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: results[0].variants?.nodes?.[0]?.price?.currencyCode,
          actionField: {
            list: 'search results',
            ...(isElevar ? null : {search_term: results[0].searchTerm}),
          },
          [isElevar ? 'impressions' : 'products']: results
            .slice(0, 12)
            .map(mapProductItemProduct()),
        },
      };
      handleDataLayerEvent(event);
    },
    [],
  );

  const clickSearchResultsItemEvent = useCallback(
    ({
      userProperties: _userProperties,
      variant,
    }: {
      userProperties: UserProperties;
      variant?: ProductVariant & {searchTerm?: string};
    }) => {
      if (!variant) return;
      const event = {
        event: 'dl_select_item',
        user_properties: _userProperties,
        ecommerce: {
          currencyCode: variant.price?.currencyCode,
          click: {
            actionField: {
              list: 'search results',
              action: 'click',
              ...(isElevar ? null : {search_term: variant.searchTerm}),
            },
            products: [variant].map(mapProductItemVariant()),
          },
        },
      };
      handleDataLayerEvent(event);
    },
    [],
  );

  // Subscribe to EventEmitter topics for 'view_search_results' and 'select_item' events
  useEffect(() => {
    emitter?.on('VIEW_SEARCH_PAGE_RESULTS', (results: SearchProduct[]) => {
      setSearchPageResults(results);
    });
    emitter?.on('VIEW_SEARCH_RESULTS', (results: SearchProduct[]) => {
      setSearchResults(results);
    });
    emitter?.on('CLICK_SEARCH_ITEM', (variant: ProductVariant) => {
      setClickedSearchResultsItem(variant);
    });
    return () => {
      emitter?.off('VIEW_SEARCH_PAGE_RESULTS', (results: SearchProduct[]) => {
        setSearchPageResults(results);
      });
      emitter?.off('VIEW_SEARCH_RESULTS', (results: SearchProduct[]) => {
        setSearchResults(results);
      });
      emitter?.off('CLICK_SEARCH_ITEM', (variant: ProductVariant) => {
        setClickedSearchResultsItem(variant);
      });
    };
  }, []);

  // Trigger 'user_data' and 'view_search_results' events after
  // new search page results and base data is ready
  useEffect(() => {
    if (
      !cartReady ||
      (!pathname.startsWith('/pages/search') &&
        !pathname.startsWith('/search')) ||
      !searchPageResults?.length ||
      !userProperties ||
      pathname === pathnameRef.current
    )
      return undefined;
    userDataEvent({userProperties});
    viewSearchResultsEvent({results: searchPageResults, userProperties});
    pathnameRef.current = pathname;
    return () => {
      pathnameRef.current = null;
    };
  }, [
    cartReady,
    pathname,
    searchPageResults?.map((p) => p?.handle).join(''),
    !!userProperties,
  ]);

  // Trigger 'view_search_results' events after
  // new search drawer results and base data is ready
  useEffect(() => {
    if (!searchResults || !userDataEventTriggered || !userProperties) return;
    if (isElevar) userDataEvent({userProperties});
    viewSearchResultsEvent({results: searchResults, userProperties});
  }, [searchResults, userDataEventTriggered, !!userProperties]);

  // Trigger 'select_item' after clicked search item and user event
  useEffect(() => {
    if (!clickedSearchResultsItem || !userDataEventTriggered) return;
    clickSearchResultsItemEvent({
      userProperties,
      variant: clickedSearchResultsItem,
    });
  }, [clickedSearchResultsItem, userDataEventTriggered]);
}
