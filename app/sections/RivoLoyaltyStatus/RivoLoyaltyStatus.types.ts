import type {ContainerSettings} from '~/settings/container';

export interface RivoLoyaltyStatusCms {
  container: ContainerSettings;
  heading?: string;
  subtext?: string;
  labels?: {
    creditsLabel?: string;
    lifetimeLabel?: string;
    pointsLabel?: string;
    signedOutMessage?: string;
    signInText?: string;
    tiersHeading?: string;
  };
  section?: {
    aboveTheFold?: boolean;
    fullWidth?: boolean;
    showCredits?: boolean;
    showLifetimePoints?: boolean;
    showVipTiers?: boolean;
    textColor?: string;
  };
}
