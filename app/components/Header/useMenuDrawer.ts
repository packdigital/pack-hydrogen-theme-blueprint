import {useCallback, useState} from 'react';

import type {Settings} from '~/lib/types';
import {useBodyScrollLock} from '~/hooks';

interface UseMenuDrawerProps {
  settings: Settings['header'];
}

export interface UseMenuDrawerReturn {
  handleOpenDrawer: () => void;
  handleCloseDrawer: () => void;
  handleNestedDrawer: (index: number | null) => void;
  menuDrawerOpen: boolean;
  nestedDrawerContent: Settings['header']['menu']['menuItems'][number] | null;
}

export function useMenuDrawer({
  settings,
}: UseMenuDrawerProps): UseMenuDrawerReturn {
  const {lockBodyScroll, unlockBodyScroll} = useBodyScrollLock();
  const {menuItems} = {...settings?.menu};

  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [nestedDrawerIndex, setNestedDrawerIndex] = useState<number | null>(
    null,
  );

  const handleOpenDrawer = useCallback(() => {
    setMenuDrawerOpen(true);
    lockBodyScroll();
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setMenuDrawerOpen(false);
    setNestedDrawerIndex(null);
    unlockBodyScroll();
  }, []);

  const handleNestedDrawer = useCallback((index: number | null) => {
    setNestedDrawerIndex(typeof index === 'number' ? index : null);
  }, []);

  return {
    handleOpenDrawer,
    handleCloseDrawer,
    handleNestedDrawer,
    menuDrawerOpen,
    nestedDrawerContent:
      typeof nestedDrawerIndex === 'number'
        ? menuItems?.[nestedDrawerIndex] || null
        : null,
  };
}
