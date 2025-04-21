import {useEffect, useMemo, useState} from 'react';

import type {BYOPSummaryProps} from './BuildYourOwnPack.types';
import {BYOPAddToCart} from './BYOPAddToCart';

import {Image} from '~/components/Image';
import {Svg} from '~/components/Svg';
import {useHideIframes, useLocale, usePromobar} from '~/hooks';

export function BYOPSummary({
  bundle,
  defaultHeading,
  handleRemoveFromBundle,
  clid,
  selectedVariant,
}: BYOPSummaryProps) {
  const {menuDesktopHeightClass} = usePromobar();
  const {hideIframes, resetIframes} = useHideIframes();
  const locale = useLocale();

  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const optionsLength = useMemo(() => {
    return Number(selectedVariant?.title) || 0;
  }, [selectedVariant]);

  const tierOptions = useMemo(() => {
    return Array.from({length: optionsLength}, (_, index) => ({
      message: index + 1,
    }));
  }, [optionsLength]);

  const addToCartUnlocked =
    bundle.length !== 0 && bundle.length == optionsLength;

  const heading = useMemo(() => {
    if (bundle.length === 0 && !selectedVariant) {
      return `Choose a Pack Size to get started`;
    }

    if (bundle.length === 0 && selectedVariant) {
      return `${selectedVariant.title} Pack selected, start adding items.`;
    }

    return optionsLength === bundle.length
      ? `All ${optionsLength} Selected!`
      : optionsLength > bundle.length
        ? `Choose ${optionsLength - bundle.length} more`
        : `${bundle.length} of ${optionsLength} selected`;
  }, [bundle.length, selectedVariant, optionsLength]);

  const prices = useMemo(() => {
    if (!selectedVariant?.price) return {total: '0.00'};
    return {total: selectedVariant?.price.amount};
  }, [selectedVariant?.price]);

  useEffect(() => {
    if (bundle.length === optionsLength) {
      setMobileSummaryOpen(true);
    }
  }, [bundle.length, optionsLength]);

  const safeBundle = Array.isArray(bundle) ? bundle : [];

  return (
    <div
      className={`flex transform-gpu flex-col transition-[max-height] max-md:h-[calc(var(--viewport-height)-var(--header-height-mobile)-var(--byob-subnav-height))] max-md:w-full max-md:overflow-hidden md:sticky md:top-[var(--header-height-desktop)] ${menuDesktopHeightClass} ${
        mobileSummaryOpen
          ? 'max-md:max-h-[calc(var(--viewport-height)-var(--header-height-mobile)-var(--byob-subnav-height))]'
          : 'max-md:max-h-16'
      }`}
    >
      {/* Mobile open summary button */}
      <button
        id="byob-summary-mobile-toggle"
        className="text-h6 relative flex h-16 w-full items-center justify-between gap-4  bg-blue-700 px-8 py-5 text-white  md:hidden"
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
              ({safeBundle.length}/{optionsLength})
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

      <div className={`flex max-h-full flex-1 flex-col border-l-2 `}>
        <div className="w-full max-md:hidden">
          <BYOPSummaryHeader
            addToCartUnlocked={addToCartUnlocked}
            heading={heading}
            prices={prices}
            className="bg-blue-600 px-8 py-5 text-white xl:px-[60px]"
          />
        </div>

        <div className="overflow-hidden max-md:flex-1 ">
          <div
            className={`scrollbar-hide grid h-auto max-h-full grid-cols-2 gap-4 overflow-y-auto p-2 xl:px-[20px] ${
              mobileSummaryOpen && safeBundle[0]
                ? 'max-md:pb-5 max-md:pt-10 md:py-5'
                : mobileSummaryOpen || safeBundle[0]
                  ? 'py-5'
                  : 'pb-5'
            }`}
          >
            {tierOptions?.map(({message}, index) => {
              const variant = safeBundle[index];
              const isActive = !!variant;
              return (
                <div
                  key={index}
                  className={`relative flex flex-row justify-center rounded-md border-2 border-blue-600  ${
                    isActive ? 'border-solid border-text' : 'border-dashed'
                  }
                `}
                >
                  {isActive && (
                    <button
                      aria-label="Remove from bundle"
                      className="absolute right-2 top-2 z-10 size-3 items-center justify-center"
                      type="button"
                      onClick={() => handleRemoveFromBundle(index)}
                    >
                      <Svg
                        className="w-2.5 text-blue-600"
                        src="/svgs/close.svg#close"
                        viewBox="0 0 24 24"
                      />
                    </button>
                  )}

                  {isActive ? (
                    <div className="flex grow items-center p-2 ">
                      <Image
                        data={{
                          altText: variant.product?.title || '',
                          url: variant.image?.url || '',
                          width: variant.image?.width || 0,
                          height: variant.image?.height || 0,
                        }}
                        aspectRatio={'1/1'}
                        width="40px"
                        className="aspect-square size-[40px] rounded-full object-cover"
                      />

                      <div className="flex grow p-2">
                        <h3 className="text-sm">
                          {variant.product?.title || ''}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-16 w-full flex-row items-center justify-center">
                      <div className="px-4 text-sm font-bold">{message}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`flex w-full flex-col items-center justify-center gap-5  px-8 py-3 md:px-8 ${
            mobileSummaryOpen ? 'max-md:pb-[80px]' : ''
          }`}
        >
          <div className="w-full self-start md:hidden">
            <BYOPSummaryHeader
              addToCartUnlocked={addToCartUnlocked}
              heading={heading}
              prices={prices}
            />
          </div>

          <BYOPAddToCart
            bundle={safeBundle}
            addToCartUnlocked={addToCartUnlocked}
            total={prices.total}
            clid={clid}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>
    </div>
  );
}

BYOPSummary.displayName = 'BYOPSummary';

function BYOPSummaryHeader({
  addToCartUnlocked,
  heading,
  prices,
  className,
}: {
  addToCartUnlocked: boolean;
  heading: string;
  prices: {total: string};
  className?: string;
}) {
  return (
    <div className={`flex w-full flex-col justify-between gap-2 ${className}`}>
      <h4 className="text-h5 flex-1 text-center">{heading}</h4>
    </div>
  );
}

/*
{addToCartUnlocked && (
  <div className="flex flex-col items-center">
    <h5 className="text-h5">{prices.total}</h5>
  </div>
)}
*/
