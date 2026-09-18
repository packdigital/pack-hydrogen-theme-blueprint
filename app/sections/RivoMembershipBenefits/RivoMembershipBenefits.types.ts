import type {ContainerSettings} from '~/settings/container';

export interface RivoMembershipBenefitsCms {
  container: ContainerSettings;
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  /**
   * Optional CMS copy merged onto Rivo's membership tiers by name, for the
   * imagery and taglines Rivo has no field for.
   */
  tiers?: {
    name?: string;
    tagline?: string;
    image?: {url?: string; altText?: string};
  }[];
  labels?: {
    emptyMessage?: string;
  };
  section?: {
    aboveTheFold?: boolean;
    fullWidth?: boolean;
    gridColumns?: string;
    textColor?: string;
  };
}
