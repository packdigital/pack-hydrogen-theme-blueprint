import {Fragment, memo} from 'react';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import clsx from 'clsx';

import {Svg} from '~/components/Svg';
import {useMenu} from '~/hooks';

export const Modal = memo(() => {
  const {modal, closeModal} = useMenu();

  const {className = '', ...props} = {...modal.props};

  return modal.children ? (
    <Transition appear show={!!modal.children} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
            className={clsx(
              'fixed left-1/2 top-1/2 z-50 max-h-[calc(var(--viewport-height)-2rem)] w-[calc(100%-2rem)] max-w-screen-md -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-background',
              className,
            )}
            {...props}
          >
            <button
              aria-label="Close modal"
              className="absolute right-0 top-0  z-10 flex size-7 items-center justify-center bg-neutralLightest"
              onClick={closeModal}
              type="button"
            >
              <Svg
                className="w-5 text-text"
                src="/svgs/close.svg#close"
                title="Close"
                viewBox="0 0 24 24"
              />
            </button>

            <div className="scrollbar-hide px-contained py-contained max-h-[calc(var(--viewport-height)-2rem)] overflow-y-auto">
              {modal.children}
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  ) : null;
});

Modal.displayName = 'Modal';
