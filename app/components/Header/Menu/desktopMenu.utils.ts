import type {Settings} from '~/lib/types';

export type DesktopMenuItem = Settings['header']['menu']['navItems'][number];

export const desktopMenuHasContent = (item?: DesktopMenuItem | null) =>
  Boolean(
    item &&
    (item.imageLinks?.length > 0 ||
      item.links?.length > 0 ||
      !!item.mainLink?.text),
  );
