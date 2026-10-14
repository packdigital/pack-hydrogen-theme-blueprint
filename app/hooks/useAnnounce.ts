import {useAnnouncerContext} from '~/contexts/AnnouncerProvider/useAnnouncerContext';

/**
 * Announce a message to screen readers via the global live region.
 * @example const announce = useAnnounce(); announce('Added to cart');
 */
export function useAnnounce() {
  return useAnnouncerContext().announce;
}
