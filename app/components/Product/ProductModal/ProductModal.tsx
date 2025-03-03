import {Fragment} from 'react';
import {ProductProvider} from '@shopify/hydrogen-react';
import {Analytics} from '@shopify/hydrogen';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';

import {AnalyticsEvent} from '~/components/Analytics/constants';
import {
  useGlobal,
  useProductModal,
  useProductWithGrouping,
  useRootLoaderData,
} from '~/hooks';
import type {ProductWithInitialGrouping} from '~/lib/types';

import {ProductModalPanel} from './ProductModalPanel';

export function ProductModal() {
  const {modalProduct, modalSelectedVariant} = useRootLoaderData();
  const {closeProductModal, closeProductUrl} = useProductModal();
  const {isCartReady} = useGlobal();
  const product = useProductWithGrouping(
    modalProduct as ProductWithInitialGrouping,
  );

  return (
    <Transition appear show={!!product?.id} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeProductModal}>
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-overlay" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <DialogPanel
            as="aside"
            className="fixed left-1/2 top-1/2 z-50 size-full max-h-[calc(var(--viewport-height,100vh)-1rem)] max-w-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-background text-text"
          >
            {product && (
              <ProductProvider
                data={product}
                initialVariantId={modalSelectedVariant?.id || null}
              >
                <ProductModalPanel
                  closeProductModal={closeProductModal}
                  closeProductUrl={closeProductUrl}
                  product={product}
                />

                {isCartReady && (
                  <Analytics.CustomView
                    type={AnalyticsEvent.PRODUCT_QUICK_SHOP_VIEWED}
                    customData={{
                      product,
                      selectedVariant: modalSelectedVariant,
                    }}
                  />
                )}
              </ProductProvider>
            )}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

ProductModal.displayName = 'ProductModal';
