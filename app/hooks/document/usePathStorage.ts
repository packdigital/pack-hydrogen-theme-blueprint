import {useEffect} from 'react';
import {useLocation} from 'react-router';

export function usePathStorage() {
  const {pathname} = useLocation();

  // Set previous path and current path in session storage
  useEffect(() => {
    try {
      const currentPath = sessionStorage.getItem('CURRENT_PATH') || '';
      if (pathname === currentPath) {
        sessionStorage.setItem('PREVIOUS_PATH_INLC_REFRESH', pathname);
        return;
      }
      sessionStorage.setItem('PREVIOUS_PATH', currentPath);
      sessionStorage.setItem('PREVIOUS_PATH_INLC_REFRESH', currentPath);
      sessionStorage.setItem('CURRENT_PATH', pathname);
    } catch (error) {
      console.error('Error setting path storage:', error);
    }
  }, [pathname]);

  // Set previous url and current url in session storage
  useEffect(() => {
    try {
      const url = window.location.href;
      const currentUrl = sessionStorage.getItem('CURRENT_URL') || '';
      if (url === currentUrl) {
        sessionStorage.setItem('PREVIOUS_URL_INLC_REFRESH', url);
        return;
      }
      sessionStorage.setItem('PREVIOUS_URL', currentUrl);
      sessionStorage.setItem('PREVIOUS_URL_INLC_REFRESH', currentUrl);
      sessionStorage.setItem('CURRENT_URL', url);
    } catch (error) {
      console.error('Error setting url storage:', error);
    }
  }, [pathname]);
}
