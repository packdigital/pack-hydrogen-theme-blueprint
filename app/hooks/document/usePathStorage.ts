import {useEffect} from 'react';
import {useLocation} from '@remix-run/react';

export function usePathStorage() {
  const {pathname} = useLocation();

  // Set previous path and current path in session storage
  useEffect(() => {
    const currentPath = sessionStorage.getItem('CURRENT_PATH') || '';
    if (pathname === currentPath) {
      sessionStorage.setItem('PREVIOUS_PATH_INLC_REFRESH', pathname);
      return;
    }
    sessionStorage.setItem('PREVIOUS_PATH', currentPath);
    sessionStorage.setItem('PREVIOUS_PATH_INLC_REFRESH', currentPath);
    sessionStorage.setItem('CURRENT_PATH', pathname);
  }, [pathname]);

  // Set previous url and current url in session storage
  useEffect(() => {
    const url = window.location.href;
    const currentUrl = sessionStorage.getItem('CURRENT_URL') || '';
    if (url === currentUrl) {
      sessionStorage.setItem('PREVIOUS_URL_INLC_REFRESH', url);
      return;
    }
    sessionStorage.setItem('PREVIOUS_URL', currentUrl);
    sessionStorage.setItem('PREVIOUS_URL_INLC_REFRESH', currentUrl);
    sessionStorage.setItem('CURRENT_URL', url);
  }, [pathname]);
}
