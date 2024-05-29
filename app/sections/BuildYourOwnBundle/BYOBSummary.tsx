import {useEffect, useMemo, useState} from 'react';

import {Image, Svg} from '~/components';
import {parseAsCurrency} from '~/lib/utils';
import {PRODUCT_IMAGE_ASPECT_RATIO} from '~/lib/constants';
import {useHideIframes, useLocale, usePromobar} from '~/hooks';

import {BYOBAddToCart} from './BYOBAddToCart';
import type {BYOBSummaryProps} from './BuildYourOwnBundle.types';

export function BYOBSummary({
  bundle,
  defaultHeading,
  handleRemoveFromBundle,
  tiers,
}: BYOBSummaryProps) {
  const {menuDesktopHeightClass} = usePromobar();
  const {hideIframes, resetIframes} = useHideIframes();
  const locale = useLocale();

  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const activeTier = useMemo(() => {
    if (!bundle.length) return null;
    const tierIndex =
      bundle.length > tiers.length ? tiers.length - 1 : bundle.length - 1;
    return tiers[tierIndex];
  }, [tiers, bundle.length]);

  const tierIndexWithFirstDiscount = useMemo(() => {
    return tiers?.findIndex(({type}) => !!type && type !== 'none');
  }, [tiers]);

  const addToCartUnlocked =
    tierIndexWithFirstDiscount >= 0 &&
    bundle.length >= tierIndexWithFirstDiscount + 1;
  const heading =
    activeTier?.heading || defaultHeading || 'Customize your bundle';

  const prices = useMemo(() => {
    if (!activeTier || activeTier.type === 'none' || !addToCartUnlocked) {
      return {compareAtTotal: '', total: ''};
    }
    const compareAtTotal = bundle.reduce((acc, variant) => {
      return acc + Number(variant.price.amount);
    }, 0);
    let total;
    if (activeTier.type === 'buyXGetYFree') {
      const cheapestVariant = bundle.reduce((acc, variant) => {
        return acc.price.amount < variant.price.amount ? acc : variant;
      }, bundle[0]);
      total = compareAtTotal - Number(cheapestVariant.price.amount);
    } else {
      total = compareAtTotal - (compareAtTotal * activeTier.percent) / 100;
    }
    return {
      compareAtTotal: parseAsCurrency(compareAtTotal, locale),
      total: parseAsCurrency(total, locale),
    };
  }, [addToCartUnlocked, bundle, activeTier, locale]);

  useEffect(() => {
    if (bundle.length === tiers?.length) {
      setMobileSummaryOpen(true);
    }
  }, [bundle.length, tiers?.length]);

  return (
    <div
      className={`flex transform-gpu flex-col bg-background transition-[max-height] max-md:h-[calc(var(--viewport-height)-var(--header-height-mobile)-var(--byob-subnav-height))] max-md:w-full max-md:overflow-hidden md:sticky md:top-[var(--header-height-desktop)] ${menuDesktopHeightClass} ${
        mobileSummaryOpen
          ? 'max-md:max-h-[calc(var(--viewport-height)-var(--header-height-mobile)-var(--byob-subnav-height))]'
          : 'max-md:max-h-16'
      }`}
    >
      {/* Mobile open summary button */}
      <button
        id="byob-summary-mobile-toggle"
        className="text-h6 relative flex h-16 w-full items-center justify-between gap-4 bg-darkGray px-8 py-5 text-white md:hidden"
        type="button"
        onClick={() => {
          setMobileSummaryOpen(!mobileSummaryOpen);
          if (!mobileSummaryOpen) {
            hideIframes();
            const el = document.getElementById('byob-summary-mobile-toggle');
            if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
          } else {
            resetIframes();
          }
        }}
      >
        <div className="text-body flex flex-1 items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-bold">Your Bundle</span>
            <span className="text-sm font-normal">
              ({bundle.length}/{tiers?.length})
            </span>
          </div>

          <span className="text-xs uppercase tracking-wider">
            {mobileSummaryOpen ? 'Hide' : 'Open'}
          </span>
        </div>

        <Svg
          className={`w-4 ${mobileSummaryOpen ? 'rotate-180' : ''}`}
          src="/svgs/chevron-down.svg#chevron-down"
          viewBox="0 0 24 24"
        />
      </button>

      <div className={`flex max-h-full flex-1 flex-col`}>
        <div className="w-full bg-offWhite max-md:hidden">
          <BYOBSummaryHeader
            addToCartUnlocked={addToCartUnlocked}
            heading={heading}
            prices={prices}
            className="px-8 py-5 xl:px-[60px]"
          />
        </div>

        <div className="overflow-hidden border-b border-border bg-offWhite max-md:flex-1">
          <ul
            className={`scrollbar-hide grid h-auto max-h-full grid-cols-1 overflow-y-auto px-8 xl:px-[60px] ${
              mobileSummaryOpen && bundle[0]
                ? 'max-md:pb-5 max-md:pt-10 md:py-5'
                : mobileSummaryOpen || bundle[0]
                ? 'py-5'
                : 'pb-5'
            }`}
          >
            {tiers?.map(({message}, index, arr) => {
              const variant = bundle[index];
              const isActive = !!variant;
              return (
                <li key={index} className="flex flex-col items-center">
                  <div
                    className={`relative mx-auto grid w-full max-w-[360px] place-items-center gap-3 rounded-md border bg-background p-4 transition xl:gap-5 ${
                      isActive
                        ? 'grid-cols-[28px_1fr] border-solid border-text'
                        : 'min-h-16 grid-cols-[28px_1fr_28px] border-dashed border-border'
                    }`}
                  >
                    <div
                      className={`flex size-[28px] items-center justify-center rounded-[50%] transition ${
                        isActive ? 'bg-secondary' : 'bg-gray'
                      }`}
                    >
                      {isActive ? (
                        <p className="text-white">{index + 1}</p>
                      ) : (
                        <Svg
                          className="w-2.5 text-white"
                          src="/svgs/lock.svg#lock"
                          viewBox="0 0 24 24"
                        />
                      )}
                    </div>

                    <div className="relative flex w-full items-center justify-center">
                      {isActive ? (
                        <div className="flex w-full gap-2">
                          <Image
                            data={{
                              altText: variant.product.title,
                              url: variant.image?.url,
                              width: variant.image?.width,
                              height: variant.image?.height,
                            }}
                            aspectRatio={PRODUCT_IMAGE_ASPECT_RATIO}
                            width="50px"
                          />
                          <div>
                            <h3 className="text-h5">{variant.product.title}</h3>
                            <p className="text-sm">{variant.title}</p>
                          </div>
                        </div>
                      ) : (
                        <p
                          className={`relative text-center text-sm ${
                            index === arr.length - 1
                              ? 'z-[1] text-white after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-[calc(100%+8px)] after:w-[calc(100%+32px)] after:origin-center after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-primary after:transition'
                              : 'text-darkGray'
                          }`}
                        >
                          {message}
                        </p>
                      )}
                    </div>

                    {isActive ? (
                      <button
                        aria-label="Remove from bundle"
                        className="absolute bottom-[calc(100%-16px)] left-[calc(100%-16px)] flex size-8 items-center justify-center rounded-[50%] bg-text"
                        type="button"
                        onClick={() => handleRemoveFromBundle(index)}
                      >
                        <Svg
                          className="w-2.5 text-white"
                          src="/svgs/close.svg#close"
                          viewBox="0 0 24 24"
                        />
                      </button>
                    ) : (
                      <div />
                    )}

                    {!isActive && (
                      <button
                        aria-label="Scroll to product selection"
                        className="absolute inset-0 size-full"
                        type="button"
                        onClick={() => {
                          if (isActive) return;
                          setMobileSummaryOpen(false);
                          setTimeout(() => {
                            const el =
                              document.getElementById('byob-grid-anchor');
                            el?.scrollIntoView({behavior: 'smooth'});
                          }, 100);
                        }}
                      />
                    )}
                  </div>

                  {index !== arr.length - 1 && (
                    <div
                      className={`pointer-events-none h-5 w-px transition ${
                        isActive ? 'bg-text' : 'bg-border'
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className={`flex w-full flex-col items-center justify-center gap-5 border-b border-border px-8 py-5 md:px-8 ${
            mobileSummaryOpen ? 'max-md:pb-[80px]' : ''
          }`}
        >
          <div className="w-full self-start md:hidden">
            <BYOBSummaryHeader
              addToCartUnlocked={addToCartUnlocked}
              heading={heading}
              prices={prices}
            />
          </div>

          <BYOBAddToCart
            bundle={bundle}
            addToCartUnlocked={addToCartUnlocked}
            total={prices.total}
          />
        </div>
      </div>
    </div>
  );
}

BYOBSummary.displayName = 'BYOBSummary';

function BYOBSummaryHeader({
  addToCartUnlocked,
  heading,
  prices,
  className,
}: {
  addToCartUnlocked: boolean;
  heading: string;
  prices: {compareAtTotal: string; total: string};
  className?: string;
}) {
  return (
    <div className={`flex w-full justify-between gap-2 ${className}`}>
      <h2 className="text-h4 flex-1">{heading}</h2>

      {addToCartUnlocked && (
        <div className="flex flex-col items-end">
          <p>{prices.total}</p>
          <p className="text-darkGray line-through">{prices.compareAtTotal}</p>
        </div>
      )}
    </div>
  );
}
