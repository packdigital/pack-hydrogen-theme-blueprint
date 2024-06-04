import {Fragment} from 'react';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';

import {Svg} from '~/components';

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param ariaName - name of drawer for aria-label
 * @param secondHeaderElement - react node. Shown at the top right of the drawer.
 * @param children - react children node.
 */

interface DrawerProps {
  className?: string;
  heading?: React.ReactNode | string;
  open: boolean;
  onClose: () => void;
  openFrom?: 'right' | 'left';
  ariaName?: string;
  secondHeaderElement?: React.ReactNode;
  children: React.ReactNode;
}

export function Drawer({
  className = '',
  heading,
  open,
  onClose,
  openFrom = 'right',
  ariaName = 'drawer',
  secondHeaderElement,
  children,
}: DrawerProps) {
  const offScreen = {
    right: 'translate-x-full',
    left: '-translate-x-full',
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-50 ${className}`}
        onClose={onClose}
      >
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
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)]" />
        </TransitionChild>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`fixed inset-y-0 flex max-w-full ${
                openFrom === 'right' ? 'right-0' : ''
              }`}
            >
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <DialogPanel
                  as="aside"
                  className="flex h-[var(--viewport-height)] w-screen flex-col justify-between overflow-hidden bg-background align-middle shadow-xl transition-all md:max-w-[var(--drawer-width)]"
                >
                  {/* Drawer header */}
                  <header className="relative flex items-center justify-center border-b border-b-border px-16 max-md:h-[var(--header-height-mobile)] md:h-[var(--header-height-desktop)]">
                    <button
                      aria-label={`Close ${ariaName}`}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={onClose}
                      type="button"
                    >
                      <Svg
                        className="w-5"
                        src="/svgs/close.svg#close"
                        title="Close"
                        viewBox="0 0 24 24"
                      />
                    </button>

                    {typeof heading === 'string' ? (
                      <h3 className="text-center text-lg">{heading}</h3>
                    ) : (
                      heading
                    )}

                    {secondHeaderElement && (
                      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
                        {secondHeaderElement}
                      </div>
                    )}
                  </header>

                  {/* Drawer body */}
                  {children}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

Drawer.Title = Dialog.Title;
Drawer.displayName = 'Drawer';
