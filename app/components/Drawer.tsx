import {Fragment} from 'react';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import clsx from 'clsx';

import {Svg} from '~/components/Svg';

/**
 * Drawer component that opens on user click.
 * @param ariaName - name of drawer for aria-label
 * @param children - react children node.
 * @param heading - string. Shown at the top of the drawer.
 * @param onClose - function should set the open state.
 * @param open - boolean. If true, opens the drawer.
 * @param openFrom - right, left
 * @param secondHeaderElement - react node. Shown at the top right of the drawer.
 * @param unmount - boolean. Whether the content should unmounted or hidden based on the open/closed state.
 */

interface DrawerProps {
  ariaName?: string;
  children: React.ReactNode;
  className?: string;
  heading?: React.ReactNode | string;
  onClose: () => void;
  open: boolean;
  openFrom?: 'right' | 'left';
  secondHeaderElement?: React.ReactNode;
  unmount?: boolean;
}

export function Drawer({
  ariaName = 'drawer',
  className = '',
  heading,
  onClose,
  open,
  openFrom = 'right',
  secondHeaderElement,
  unmount = true,
  children,
}: DrawerProps) {
  const offScreen = {
    right: 'translate-x-full',
    left: '-translate-x-full',
  };

  return (
    <Transition appear show={open} as={Fragment} unmount={unmount}>
      <Dialog
        as="div"
        className={clsx('relative z-50', className)}
        unmount={unmount}
        onClose={onClose}
      >
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={unmount}
        >
          <div className="fixed inset-0 bg-overlay" />
        </TransitionChild>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={clsx(
                'fixed inset-y-0 flex max-w-full',
                openFrom === 'right' && 'right-0',
              )}
            >
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
                unmount={unmount}
              >
                <DialogPanel
                  as="aside"
                  data-comp={Drawer.displayName}
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

Drawer.displayName = 'Drawer';
