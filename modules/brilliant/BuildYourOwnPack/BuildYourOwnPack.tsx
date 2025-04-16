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
import {BYOPProductItem} from './BYOPProductItem';
import {BYOPSubnav} from './BYOPSubnav';
import {BYOPSummary} from './BYOPSummary';
import {BYOPTierSelector} from './BYOPTierSelector';

import {Container} from '~/components/Container';
import {useProductsByIds, useProductByHandle} from '~/hooks';
import type {ProductCms} from '~/lib/types';

export function BuildYourOwnPack({cms}: {cms: BuildYourOwnPackCms}) {
  const {productGroupings, defaultHeading, preselects} = cms;

  //Get all our variant information
  const packProduct = useProductByHandle(BYOP_PRODUCT_HANDLE);
  const variants = useMemo((): ProductVariant[] => {
    if (!packProduct) return [];
    if (packProduct?.variants && packProduct.variants?.nodes.length === 0)
      return [];
    return packProduct.variants.nodes;
  }, [packProduct]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [bundle, setBundle] = useState<ProductVariant[]>([]);
  //Default to the first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

  //Added this as sometimes i wasnt getting the variant pre-selected?
  useEffect(() => {
    if (variants[0]) {
      setSelectedVariant(variants[0]);
    }
  }, [variants]);

  //Before trying to set any preselect items check if we have a clid and get our cartLineItems
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const clid = searchParams.get('clid') || '';
  const ts = searchParams.get('ts') || false; //additional TS for chosenItems

  const {lines} = useCart();

  useEffect(() => {
    if (!clid || !lines) return;
    setBundle([]);
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

    const cartVariant = variants.find(
      (variant) => variant.id === cartLine.merchandise?.id,
    );

    if (cartVariant) {
      setSelectedVariant(cartVariant);
    }
  }, [clid, lines, ts, variants]);

  useEffect(() => {});

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

  const bundleMapById = useMemo(() => {
    return bundle.reduce((acc: BundleMapById, variant, index) => {
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
  }, [bundle]);

  const preselectedProducts = useProductsByIds(validPreselectedIds);

  const hasProductGroupings = productGroupings?.length > 1;
  const incrementDisabled =
    !!selectedVariant && bundle.length >= Number(selectedVariant.title); //in our variants, size options value is the title

  const handleTierChange = useCallback(
    (variant: ProductVariant) => {
      setSelectedVariant(variant);
      //trim the bundle to match the count
      setBundle(bundle.slice(0, Number(variant.title)));
    },
    [setSelectedVariant, bundle],
  );

  const handleRemoveFromBundle = useCallback(
    (index: number) => {
      if (index < 0) return;
      setBundle((prevBundle) => {
        return prevBundle.filter((_, i) => i !== index);
      });
    },
    [setBundle],
  );

  const handleAddToBundle = useCallback(
    (product: ProductVariant) => {
      if (incrementDisabled) return;
      setBundle((prevBundle) => {
        return [...prevBundle, product];
      });
    },
    [incrementDisabled, setBundle],
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
      setBundle(availableVariants);
    }
  }, [preselectedProducts, clid, ts]);

  // Set CSS variable for mobile subnav height based on whether product groupings exist
  useEffect(() => {
    const subnavHeight = `${BYOP_SUBNAV_HEIGHT}px`;
    document.documentElement.style.setProperty(
      '--byob-subnav-height',
      hasProductGroupings ? subnavHeight : '0px',
    );
  }, [hasProductGroupings]);

  return (
    <Container container={cms.container}>
      <div
        /* if changing px width of second grid column, e.g. md:grid-cols-[1fr_360px],
         * also change corresponding breakpoint max width in BYOBSubnav, e.g. md:max-w-[calc(100vw-360px)] */
        className="w-full max-md:flex max-md:flex-col md:grid md:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px]"
      >
        <div className="order-1 max-md:sticky max-md:top-[var(--header-height-mobile)] max-md:z-[2] md:hidden">
          {hasProductGroupings && (
            <BYOPSubnav
              activeTabIndex={activeTabIndex}
              productGroupings={productGroupings}
              setActiveTabIndex={setActiveTabIndex}
            />
          )}
        </div>

        <div className="relative bg-background max-md:order-3">
          <BYOPTierSelector
            variants={variants}
            handleSelect={handleTierChange}
            selectedVariant={selectedVariant}
          />

          <div
            id="byob-grid-anchor"
            className="pointer-events-none absolute left-0 max-md:bottom-[calc(100%+132px+var(--byob-subnav-height))] md:bottom-[calc(100%+20px+var(--byob-subnav-height))]"
          />

          {hasProductGroupings && (
            <BYOPSubnav
              activeTabIndex={activeTabIndex}
              productGroupings={productGroupings}
              setActiveTabIndex={setActiveTabIndex}
              className="max-md:hidden md:sticky md:top-[var(--header-height-desktop)]"
            />
          )}

          {productGroupings?.map(({name, products}, index) => {
            if (
              hasProductGroupings &&
              activeTabIndex !== 0 &&
              activeTabIndex !== index + 1
            )
              return null;
            return (
              <div key={index}>
                {hasProductGroupings && (
                  <div className="px-contained border-b border-border bg-neutralLightest py-5">
                    <h2 className="text-h4">{name}</h2>
                  </div>
                )}

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products?.map(({product}, productIndex) => {
                    return product ? (
                      <li className="p-4" key={productIndex}>
                        <BYOPProductItem
                          bundle={bundle}
                          bundleMapById={bundleMapById}
                          handle={product.handle}
                          index={productIndex}
                          incrementDisabled={incrementDisabled}
                          handleRemoveFromBundle={handleRemoveFromBundle}
                          handleAddToBundle={handleAddToBundle}
                        />
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/*bg-background max-md:sticky max-md:top-[calc(var(--header-height-mobile)+var(--byob-subnav-height))] max-md:z-[1] max-md:order-2" */}
        <div className="bg-background max-md:sticky max-md:top-[calc(var(--header-height-mobile)+var(--byob-subnav-height))] max-md:z-[1] max-md:order-2">
          <BYOPSummary
            bundle={bundle}
            defaultHeading={defaultHeading}
            handleRemoveFromBundle={handleRemoveFromBundle}
            clid={clid}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>
    </Container>
  );
}

BuildYourOwnPack.displayName = 'BuildYourOwnPack';
BuildYourOwnPack.Schema = Schema;
