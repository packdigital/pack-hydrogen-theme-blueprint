import {
  useCallback,
  // useEffect,
  useState,
} from 'react';

// import {useBodyScrollLock, useMenu} from '~/hooks';

export interface UseDesktopMenuReturn {
  desktopMenuIndex: number | null;
  /* Desktop menu based on hover ----------------------------------------------- */
  handleDesktopMenuClose: () => void;
  handleDesktopMenuStayOpen: () => void;
  handleDesktopMenuHoverIn: (index: number) => void;
  handleDesktopMenuHoverOut: () => void;
  /* Desktop menu based on click ----------------------------------------------- */
  // desktopSubmenuIndex: number | null;
  // handleDesktopMenuOpen: (index: number) => void;
  // handleDesktopMenuClose: () => void;
  // handleDesktopSubmenuOpen: (index: number) => void;
  // handleDesktopSubmenuClose: () => void;
}

/*
 * By default, Blueprint themes use a hover-based desktop menu.
 * If you need to change the behavior of the desktop menu to on-click, you can instead
 * utilize the commented out code in this hook. You will also need to update the
 * components that use this hook to use the new functions accordingly.
 */

export function useDesktopMenu(): UseDesktopMenuReturn {
  const [desktopMenuIndex, setDesktopMenuIndex] = useState<number | null>(null);

  // /* Additional hooks for desktop menu based on click ------------------------- */
  // const {lockBodyScroll, unlockBodyScroll} = useBodyScrollLock();
  // const {desktopMenuOpen, openDesktopMenu, closeDesktopMenu} = useMenu();
  // const [desktopSubmenuIndex, setDesktopSubmenuIndex] = useState<number | null>(
  //   null,
  // );
  // /* -------------------------------------------------------------------------- */

  /* Desktop menu based on hover ----------------------------------------------- */
  const clearUnHoverTimer = useCallback(() => {
    if (window.unHover) {
      clearTimeout(window.unHover);
      window.unHover = null;
    }
  }, []);

  const handleDesktopMenuClose = useCallback(() => {
    setDesktopMenuIndex(null);
  }, []);

  const handleDesktopMenuStayOpen = useCallback(() => {
    clearUnHoverTimer();
    setDesktopMenuIndex(desktopMenuIndex);
  }, [desktopMenuIndex]);

  const handleDesktopMenuHoverIn = useCallback((index: number) => {
    clearUnHoverTimer();
    setDesktopMenuIndex(typeof index === 'number' ? index : null);
  }, []);

  const handleDesktopMenuHoverOut = useCallback(() => {
    clearUnHoverTimer();
    window.unHover = setTimeout(() => {
      setDesktopMenuIndex(null);
      clearUnHoverTimer();
    }, 100);
  }, []);
  /* -------------------------------------------------------------------------- */

  // /* Desktop menu based on click ----------------------------------------------- */
  // const handleDesktopMenuOpen = useCallback((index: number) => {
  //   openDesktopMenu();
  //   setDesktopMenuIndex(typeof index === 'number' ? index : null);
  //   setDesktopSubmenuIndex(null);
  // }, []);

  // const handleDesktopMenuClose = useCallback(() => {
  //   closeDesktopMenu();
  //   setDesktopMenuIndex(null);
  //   setDesktopSubmenuIndex(null);
  // }, []);

  // const handleDesktopSubmenuOpen = useCallback((index: number) => {
  //   setDesktopSubmenuIndex(typeof index === 'number' ? index : null);
  // }, []);

  // const handleDesktopSubmenuClose = useCallback(() => {
  //   setDesktopSubmenuIndex(null);
  // }, []);

  // useEffect(() => {
  //   if (desktopMenuOpen) {
  //     lockBodyScroll();
  //   } else {
  //     handleDesktopMenuClose();
  //     unlockBodyScroll();
  //   }
  // }, [desktopMenuOpen]);
  // /* -------------------------------------------------------------------------- */

  return {
    desktopMenuIndex,
    /* Desktop menu based on hover --------------------------------------------- */
    handleDesktopMenuClose,
    handleDesktopMenuStayOpen,
    handleDesktopMenuHoverIn,
    handleDesktopMenuHoverOut,
    /* Desktop menu based on click --------------------------------------------- */
    // desktopSubmenuIndex,
    // handleDesktopMenuOpen,
    // handleDesktopMenuClose,
    // handleDesktopSubmenuOpen,
    // handleDesktopSubmenuClose,
  };
}
