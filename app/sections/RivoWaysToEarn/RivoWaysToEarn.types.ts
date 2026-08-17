import type {ContainerSettings} from '~/settings/container';

export interface RivoWaysToEarnCms {
  container: ContainerSettings;
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  /**
   * Rivo's earning rules carry no icon, so icons are matched by the rule's
   * `trigger` key (e.g. `order_placed`, `customer_birthday`, `tiktok_follow`).
   */
  icons?: {
    trigger?: string;
    image?: {url?: string; altText?: string};
  }[];
  labels?: {
    completedText?: string;
    emptyMessage?: string;
  };
  section?: {
    aboveTheFold?: boolean;
    fullWidth?: boolean;
    gridColumns?: string;
    textColor?: string;
  };
}
