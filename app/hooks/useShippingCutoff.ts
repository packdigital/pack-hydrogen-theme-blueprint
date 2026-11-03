import {useEffect, useMemo, useState} from 'react';

import {
  formatShippingCutoffMessage,
  getActiveShippingCutoff,
} from '~/lib/utils/shipping-cutoff.utils';
import type {ShippingCutoffSettings} from '~/settings/shipping-cutoff';

import {useIsHydrated} from './useIsHydrated';
import {useLocale} from './locale';
import {useSettings} from './useSettings';

const TICK_MS = 60 * 1000;

export type ShippingCutoffPlacement =
  keyof ShippingCutoffSettings['placements'];

/**
 * Hook for the shipping cutoff message to show at a placement, or null
 * @param placement - where the message renders: pdp, cartLine or cartTotals
 * @returns message with {{date}} and {{countdown}} filled in, or null
 *
 * Renders client-side only: the message depends on the current time, and
 * SSR output is cached, so a server-rendered deadline would go stale.
 */
export function useShippingCutoff(
  placement: ShippingCutoffPlacement,
): string | null {
  const {shippingCutoff} = useSettings();
  const {pathPrefix} = useLocale();
  const isHydrated = useIsHydrated();
  const [now, setNow] = useState(() => Date.now());

  const {
    enabled = false,
    timezone = 'America/New_York',
    hideForInternational = true,
    placements,
    cutoffs = [],
    afterLastCutoffMessage = '',
  } = {...shippingCutoff};

  const isVisible =
    enabled &&
    !!placements?.[placement] &&
    !(hideForInternational && pathPrefix);

  useEffect(() => {
    if (!isVisible) return undefined;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(interval);
  }, [isVisible]);

  return useMemo(() => {
    if (!isHydrated || !isVisible) return null;
    const timeZone = timezone?.trim() || 'America/New_York';
    const {active, allPassed} = getActiveShippingCutoff({
      cutoffs,
      now,
      timeZone,
    });
    if (active) {
      return formatShippingCutoffMessage({cutoff: active, now, timeZone});
    }
    return allPassed && afterLastCutoffMessage ? afterLastCutoffMessage : null;
  }, [isHydrated, isVisible, timezone, cutoffs, now, afterLastCutoffMessage]);
}
