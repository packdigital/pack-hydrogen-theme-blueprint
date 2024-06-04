import {useCallback, useEffect, useMemo, useState} from 'react';
import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

import {Container} from '~/components';
import {useProductsFromHandles} from '~/hooks';
import type {ProductCms} from '~/lib/types';

import {BYOBProductItem} from './BYOBProductItem';
import {BYOBSummary} from './BYOBSummary';
import {BYOBSubnav} from './BYOBSubnav';
import {Schema} from './BuildYourOwnBundle.schema';
import type {
  BuildYourOwnBundleCms,
  BundleMapById,
} from './BuildYourOwnBundle.types';

export const BYOB_SUBNAV_HEIGHT = 48;

export function BuildYourOwnBundle({cms}: {cms: BuildYourOwnBundleCms}) {
  const {productGroupings, tiers, defaultHeading, preselects} = cms;

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [bundle, setBundle] = useState<ProductVariant[]>([]);

  const validPreselectedHandles = useMemo((): string[] => {
    if (!preselects?.length || !productGroupings?.length) return [];
    const allProductsMap = productGroupings.reduce(
      (acc: Record<string, ProductCms>, {products}) => {
        products?.forEach(({product}) => {
          if (!product) return;
          acc[product.handle] = product;
        });
        return acc;
      },
      {},
    );
    return preselects.reduce((acc: string[], {product}) => {
      if (!allProductsMap[product?.handle]) return acc;
      return [...acc, product.handle];
    }, []);
  }, [preselects, productGroupings]);

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

  const preselectedProducts = useProductsFromHandles(validPreselectedHandles);

  const hasProductGroupings = productGroupings?.length > 1;
  const incrementDisabled = !!tiers && bundle.length >= tiers.length;

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
    setBundle(availableVariants);
  }, [preselectedProducts]);

  // Set CSS variable for mobile subnav height based on whether product groupings exist
  useEffect(() => {
    const subnavHeight = `${BYOB_SUBNAV_HEIGHT}px`;
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
        className="w-full max-md:flex max-md:flex-col md:grid md:grid-cols-[1fr_360px] xl:grid-cols-[1fr_480px]"
      >
        <div className="order-1 max-md:sticky max-md:top-[var(--header-height-mobile)] max-md:z-[2] md:hidden">
          {hasProductGroupings && (
            <BYOBSubnav
              activeTabIndex={activeTabIndex}
              productGroupings={productGroupings}
              setActiveTabIndex={setActiveTabIndex}
            />
          )}
        </div>

        <div className="relative bg-background max-md:order-3 md:border-r md:border-border">
          <div
            id="byob-grid-anchor"
            className="pointer-events-none absolute left-0 max-md:bottom-[calc(100%+132px+var(--byob-subnav-height))] md:bottom-[calc(100%+20px+var(--byob-subnav-height))]"
          />

          {hasProductGroupings && (
            <BYOBSubnav
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
                  <div className="px-contained border-b border-border bg-offWhite py-5">
                    <h2 className="text-h4">{name}</h2>
                  </div>
                )}

                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products?.map(({product}, productIndex) => {
                    return product ? (
                      <li key={productIndex} className="h-full">
                        <BYOBProductItem
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

        <div className="max-md:sticky max-md:top-[calc(var(--header-height-mobile)+var(--byob-subnav-height))] max-md:z-[1] max-md:order-2">
          <BYOBSummary
            bundle={bundle}
            tiers={tiers}
            defaultHeading={defaultHeading}
            handleRemoveFromBundle={handleRemoveFromBundle}
          />
        </div>
      </div>
    </Container>
  );
}

BuildYourOwnBundle.displayName = 'BuildYourOwnBundle';
BuildYourOwnBundle.Schema = Schema;
