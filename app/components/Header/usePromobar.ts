import {useState} from 'react';

import type {Settings} from '~/lib/types';

const PROMOBAR_HEIGHT = 48;

interface UsePromobarProps {
  settings?: Settings['header'];
}

export interface UsePromobarReturn {
  promobarDisabled: boolean;
  promobarHeight: number;
  promobarHidden: boolean;
  setPromobarHidden: (value: boolean) => void;
}

export function usePromobar({settings}: UsePromobarProps): UsePromobarReturn {
  const [promobarHidden, setPromobarHidden] = useState(false);

  const promobar = settings?.promobar;
  const promobarDisabled =
    !!promobar && (!promobar.enabled || !promobar.messages?.length);

  return {
    promobarDisabled,
    promobarHeight: PROMOBAR_HEIGHT,
    promobarHidden,
    setPromobarHidden,
  };
}
