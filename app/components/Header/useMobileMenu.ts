import {useCallback, useState} from 'react';

import {useMenu} from '~/hooks';

export interface UseMobileMenuReturn {
  handleOpenMobileMenu: () => void;
  handleCloseMobileMenu: () => void;
  handleMobileSubmenu: (index: number | null) => void;
  mobileMenuOpen: boolean;
  mobileSubmenuIndex: number | null;
}

export function useMobileMenu(): UseMobileMenuReturn {
  const {mobileMenuOpen, openMobileMenu, closeMobileMenu} = useMenu();

  const [mobileSubmenuIndex, setMobileSubmenuIndex] = useState<number | null>(
    null,
  );

  const handleOpenMobileMenu = useCallback(() => {
    openMobileMenu();
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    closeMobileMenu();
    setMobileSubmenuIndex(null);
  }, []);

  const handleMobileSubmenu = useCallback((index: number | null) => {
    setMobileSubmenuIndex(typeof index === 'number' ? index : null);
  }, []);

  return {
    handleOpenMobileMenu,
    handleCloseMobileMenu,
    handleMobileSubmenu,
    mobileMenuOpen,
    mobileSubmenuIndex,
  };
}
