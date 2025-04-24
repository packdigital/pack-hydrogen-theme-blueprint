import {useLocation} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';
import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {Schema} from './BuildYourOwnPack.schema';
import type {BuildYourOwnPackCms} from './BuildYourOwnPack.types';
import {BYOP_PRODUCT_HANDLE} from './BuildYourPackConfig';
import {DesktopBundleSelector} from './components/BundleSelector/DesktopBundleSelector';
import {BundleSheet} from './components/BundleSheet';
import {ProductGrid} from './components/ProductGrid/ProductGrid';
import {ProgressSection} from './components/ProgressSection';

import {Container} from '~/components/Container';
import {Separator} from '~/components/ui/separator';
import {useProductsByIds, useProductByHandle} from '~/hooks';
import type {ProductCms} from '~/lib/types';

export function BuildYourOwnPack({cms}: {cms: BuildYourOwnPackCms}) {
  const {productGroupings = [], defaultHeading = ''} = cms || {};

  //Get all our variant information
  const packProduct = useProductByHandle(BYOP_PRODUCT_HANDLE);

  //used to be called variants
  const availableBundles = useMemo((): ProductVariant[] => {
    if (!packProduct) return [];
    if (packProduct?.variants && packProduct.variants?.nodes.length === 0)
      return [];
    return packProduct.variants.nodes;
  }, [packProduct]);

  //Default to the first variant
  const [selectedBundle, setSelectedBundle] = useState<ProductVariant>();
  const [selectedItems, setSelectedItems] = useState<ProductVariant[]>([]);
  //Bundles Sheet State - Loads View of all selected items in a side/bottom drawer
  const [bundleSheetOpen, setBundleSheetOpen] = useState(false);

  //Before trying to set any preselect items check if we have a clid and get our cartLineItems
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const clid = searchParams.get('clid') || '';
  const ts = searchParams.get('ts') || false; //additional TS for chosenItems
  const addedToCart = searchParams.get('added') || false;
  //console.log('ADDED=', addedToCart);

  const {lines} = useCart();

  //Added this as sometimes i wasnt getting the variant pre-selected?
  useEffect(() => {
    if (availableBundles[0]) {
      setSelectedBundle(availableBundles[0]);
    }
  }, [availableBundles]);

  //TS (timestmap) should help keep things in sync
  useEffect(() => {
    if (!clid || !lines) return;
    setSelectedItems([]);
  }, [ts, clid, lines]);

  const chosenItems = useMemo((): {id: string}[] => {
    //If we have CLID we need to get those product variant ids out.
    if (!clid && !ts && !lines) return [];
    // Find the cart line matching `clid`
    const cartLine = lines?.find((line) => line?.id === clid);
    if (!cartLine) return [];

    const itemsToEdit =
      cartLine.attributes
        ?.filter((attr) => attr?.value?.startsWith('gid://shopify/Product/')) // Keep only product IDs
        ?.flatMap((attr, index) => {
          // Find the matching quantity attribute for this product
          const qtyAttr = cartLine?.attributes?.find(
            (qAttr) => qAttr?.key === `_item_${index}_qty`,
          );
          const quantity = qtyAttr?.value
            ? parseInt(qtyAttr.value, 10) || 1
            : 1; // Default to 1 if missing

          return Array.from({length: quantity}, () => ({
            id: attr?.value ?? '',
          }));
        }) || [];

    return itemsToEdit;
  }, [clid, lines, ts]);

  //Set selected variant equal to the cart type
  useEffect(() => {
    if (!clid && !ts && !lines) return;
    // Find the cart line matching `clid`
    const cartLine = lines?.find((line) => line?.id === clid);
    if (!cartLine) return;

    const cartVariant = availableBundles.find(
      (variant) => variant.id === cartLine.merchandise?.id,
    );

    if (cartVariant) {
      setSelectedBundle(cartVariant);
    }
  }, [clid, lines, ts, availableBundles]);

  //PRESELECTS DRIVEN FROM CMS
  const validPreselectedIds = useMemo((): string[] => {
    if (!chosenItems?.length || !productGroupings?.length) return [];

    const allProductsMap = productGroupings.reduce(
      (acc: Record<string, ProductCms>, {products}) => {
        products?.forEach(({product}) => {
          if (!product) return;
          acc[product.id] = product;
        });
        return acc;
      },
      {},
    );

    return chosenItems.reduce((acc: string[], product: {id: string}) => {
      const productId = product?.id ?? '';
      if (!productId || !allProductsMap[productId]) return acc;
      return [...acc, productId];
    }, []);
  }, [chosenItems, productGroupings]);
  const preselectedProducts = useProductsByIds(validPreselectedIds);

  /*
  const bundleMapById = useMemo(() => {
    return selectedItems.reduce((acc: BundleMapById, variant, index) => {
      if (acc[variant.id]) {
        return {
          ...acc,
          [variant.id]: {
            ...acc[variant.id],
            indexes: [...acc[variant.id].indexes, index],
          },
        };
      }
      return {
        ...acc,
        [variant.id]: {
          ...variant,
          indexes: [index],
        },
      };
    }, {});
  }, [selectedItems]);
*/

  const incrementDisabled =
    !!selectedBundle && selectedItems.length >= Number(selectedBundle.title); //in our variants, size options value is the title

  const handleTierChange = useCallback(
    (variant: ProductVariant) => {
      setSelectedBundle(variant);
      //trim the bundle to match the count
      setSelectedItems(selectedItems.slice(0, Number(variant.title)));
    },
    [selectedItems],
  );

  const handleRemoveFromBundle = useCallback((id: string) => {
    if (!id) return;
    setSelectedItems((prevItems) => {
      const firstMatch = prevItems.findIndex((item) => id === item.id);
      return prevItems.filter((_, index) => index !== firstMatch);
    });
  }, []);

  const handleAddToBundle = useCallback(
    (product: ProductVariant) => {
      if (incrementDisabled) return;
      setSelectedItems((prevBundle) => {
        return [...prevBundle, product];
      });
    },
    [incrementDisabled],
  );

  useEffect(() => {
    if (!preselectedProducts?.length) return;
    const availableVariants = preselectedProducts.reduce(
      (acc: ProductVariant[], product) => {
        const firstVariant = product.variants?.nodes?.[0];
        if (!firstVariant?.availableForSale) return acc;
        return [...acc, firstVariant];
      },
      [],
    );

    if (availableVariants.length) {
      setSelectedItems(availableVariants);
    }
  }, [preselectedProducts, clid, ts]);

  /*
  // Set CSS variable for mobile subnav height based on whether product groupings exist
  useEffect(() => {
    const subnavHeight = `${BYOP_SUBNAV_HEIGHT}px`;
    document.documentElement.style.setProperty(
      '--byob-subnav-height',
      hasProductGroupings ? subnavHeight : '0px',
    );
  }, [hasProductGroupings]);
  */

  //Selected Items in Bundle Count
  const selectedCount = useMemo(() => {
    return selectedItems.length;
  }, [selectedItems.length]);

  const products = useMemo(() => {
    if (!productGroupings?.length) {
      return [];
    }
    return (
      productGroupings.flatMap((grouping) => {
        return grouping.products?.flatMap(({product}) => product) || [];
      }) || []
    );
  }, [productGroupings]);

  /* PAGINATION START */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  //do any filtering next
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      //filter option 1
      //filter option 2

      //return all for now
      return true;
    });
  }, [products]);

  const totalItems = useMemo(
    () => filteredProducts.length,
    [filteredProducts.length],
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    [totalItems],
  );

  const currentProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [currentPage, filteredProducts],
  );

  const gridElementId = 'bundle-grid-section';

  // Handle page change

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid when changing pages
    window.scrollTo({
      top: document.getElementById(gridElementId)?.offsetTop || 0,
      behavior: 'smooth',
    });
  }, []);

  /* PAGINATION END */

  // If no container is provided, return null on both server and client
  if (!cms?.container) {
    return null;
  }

  return (
    <Container container={cms.container}>
      {/* Use a single column layout structure for consistency between server and client */}
      <div className="w-full px-2 xl:mx-auto xl:max-w-7xl xl:px-0">
        {/* Top section with selection tools */}

        <BundleSheet
          open={bundleSheetOpen}
          onOpenChange={setBundleSheetOpen}
          selectedItems={selectedItems}
          selectedBundle={selectedBundle}
          handleRemoveFromBundle={handleRemoveFromBundle}
          clid={clid}
        />

        {addedToCart && (
          <div>
            <h3>THANKS </h3>
          </div>
        )}

        <div className="mb-4">
          <DesktopBundleSelector
            selectedBundle={selectedBundle}
            availableBundles={availableBundles}
            onBundleSelect={handleTierChange}
          />
        </div>

        <div className="mb-4">
          <ProgressSection
            viewBundleSelection={setBundleSheetOpen}
            selectedCount={selectedCount}
            selectedBundle={selectedBundle}
          />
        </div>

        <Separator className="my-3" />

        <div className="mb-8" id={gridElementId}>
          <ProductGrid
            products={currentProducts}
            selectedItems={selectedItems}
            incrementDisabled={incrementDisabled}
            handleRemoveFromBundle={handleRemoveFromBundle}
            handleAddToBundle={handleAddToBundle}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </Container>
  );
}

BuildYourOwnPack.displayName = 'BuildYourOwnPack';
BuildYourOwnPack.Schema = Schema;
