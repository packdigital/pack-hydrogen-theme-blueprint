import {useLocation} from '@remix-run/react';
import {useCart} from '@shopify/hydrogen-react';
import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {Schema} from './BuildYourOwnPack.schema';
import type {
  BuildYourOwnPackCms,
  BundleMapById,
} from './BuildYourOwnPack.types';
import {BYOP_SUBNAV_HEIGHT, BYOP_PRODUCT_HANDLE} from './BuildYourPackConfig';
import {BYOPProductItem} from './BYOPProductItem/BYOPProductItem';
import {BYOPSummary} from './BYOPSummary';
import {DesktopBundleSelector} from './components/BundleSelector/DesktopBundleSelector';
import {BundleSheet} from './components/BundleSheet';
import {ProductGrid} from './components/ProductGrid';
import {ProgressSection} from './components/ProgressSection';

import {Container} from '~/components/Container';
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

  // If no container is provided, return null on both server and client
  if (!cms?.container) {
    return null;
  }

  return (
    <Container container={cms.container}>
      {/* Use a single column layout structure for consistency between server and client */}
      <div className="flex w-full flex-col">
        {/* Top section with selection tools */}
        <div className="mx-auto w-9/12">
          <BundleSheet
            open={bundleSheetOpen}
            onOpenChange={setBundleSheetOpen}
          />

          <div className="mb-4">
            <DesktopBundleSelector
              className="p-6"
              selectedBundle={selectedBundle}
              availableBundles={availableBundles}
              onBundleSelect={handleTierChange}
            />
          </div>

          <div className="mb-4">
            <ProgressSection
              className="p-6"
              viewBundleSelection={setBundleSheetOpen}
              selectedCount={selectedCount}
              selectedBundle={selectedBundle}
            />
          </div>

          <div className="mb-8">
            <ProductGrid
              className="p-6"
              products={products}
              selectedCount={selectedCount}
              selectedBundle={selectedBundle}
              bundleProducts={selectedItems}
              bundleMapById={bundleMapById}
              incrementDisabled={incrementDisabled}
              handleRemoveFromBundle={handleRemoveFromBundle}
              handleAddToBundle={handleAddToBundle}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

BuildYourOwnPack.displayName = 'BuildYourOwnPack';
BuildYourOwnPack.Schema = Schema;
