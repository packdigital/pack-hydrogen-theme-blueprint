import {useEffect} from 'react';
import {useLocation} from '@remix-run/react';

export function useScrollToHashOnNavigation() {
  const {hash} = useLocation();

  // Scroll to hash on navigation
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({behavior: 'smooth'});
        }
      }, 0);
    }
  }, [hash]);
}
