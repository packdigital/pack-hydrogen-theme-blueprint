import type {LinkCms} from '~/lib/types';
import type {ContainerSettings} from '~/settings/container';

export interface RivoLoyaltyHeroCms {
  container: ContainerSettings;
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  image?: {url?: string; altText?: string};
  /** Shown to guests only; members see their balance instead. */
  buttons?: {
    link?: LinkCms;
    style?: string;
  }[];
  /** Signed-in state copy. `{{name}}` in `greeting` is replaced with the first name. */
  member?: {
    greeting?: string;
    greetingFallback?: string;
    pointsSuffix?: string;
    tierPrefix?: string;
    link?: LinkCms;
    linkStyle?: string;
  };
  section?: {
    aboveTheFold?: boolean;
    bgColor?: string;
    fullWidth?: boolean;
    textColor?: string;
  };
}
