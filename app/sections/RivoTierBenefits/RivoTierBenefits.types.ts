import type {ContainerSettings} from '~/settings/container';

/** CMS copy for one tier, matched to a Rivo tier by `name`. */
export interface TierContentCms {
  /** Must match the Rivo tier name exactly (case-insensitive). */
  name?: string;
  tagline?: string;
  /** Overrides the auto-generated "500+ points" label, e.g. "Spend $100". */
  thresholdLabel?: string;
  perks?: {text?: string}[];
  /** Cell values for the comparison matrix, keyed by row label. */
  benefits?: {label?: string; value?: string}[];
}

export interface RivoTierBenefitsCms {
  container: ContainerSettings;
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  tiers?: TierContentCms[];
  /** Row labels for the comparison table, in display order. */
  matrix?: {label?: string}[];
  labels?: {
    currentTierText?: string;
    emptyMessage?: string;
    freeTierLabel?: string;
    includedText?: string;
    matrixHeading?: string;
  };
  section?: {
    aboveTheFold?: boolean;
    fullWidth?: boolean;
    showMatrix?: boolean;
    textColor?: string;
  };
}
