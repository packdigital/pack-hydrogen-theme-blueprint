import {useCallback, useState} from 'react';

import type {Settings} from '~/lib/types';

interface UseMenuProps {
  settings: Settings['header'];
}

export interface UseMenuReturn {
  handleMenuClose: () => void;
  handleMenuStayOpen: () => void;
  handleMenuHoverIn: (index: number) => void;
  handleMenuHoverOut: () => void;
  menuContent: Settings['header']['menu']['menuItems'][number] | null;
  menuIndex: number | null;
}

export function useMenu({settings}: UseMenuProps): UseMenuReturn {
  const {menuItems} = {...settings?.menu};

  const [menuIndex, setMenuIndex] = useState<number | null>(null);

  const clearUnHoverTimer = useCallback(() => {
    if (window.unHover) {
      clearTimeout(window.unHover);
      window.unHover = null;
    }
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuIndex(null);
  }, []);

  const handleMenuStayOpen = useCallback(() => {
    clearUnHoverTimer();
    setMenuIndex(menuIndex);
  }, [menuIndex]);

  const handleMenuHoverIn = useCallback((index: number) => {
    clearUnHoverTimer();
    setMenuIndex(typeof index === 'number' ? index : null);
  }, []);

  const handleMenuHoverOut = useCallback(() => {
    clearUnHoverTimer();
    window.unHover = setTimeout(() => {
      setMenuIndex(null);
      clearUnHoverTimer();
    }, 100);
  }, []);

  return {
    handleMenuClose,
    handleMenuStayOpen,
    handleMenuHoverIn,
    handleMenuHoverOut,
    menuContent:
      typeof menuIndex === 'number' ? menuItems?.[menuIndex] || null : null,
    menuIndex,
  };
}
