import type {ContainerSettings} from '~/settings/container';

export interface RivoLoyaltyStatusCms {
  container: ContainerSettings;
  heading?: string;
  subtext?: string;
  labels?: {
    rewardProgressHeading?: string;
    rewardProgressSubtext?: string;
    rewardProgressCompleted?: string;
    highestTierText?: string;
    creditsLabel?: string;
    lifetimeLabel?: string;
    pointsLabel?: string;
    signedOutMessage?: string;
    signInText?: string;
    tiersHeading?: string;
  };
  section?: {
    showRewardProgress?: boolean;
    aboveTheFold?: boolean;
    fullWidth?: boolean;
    showCredits?: boolean;
    showLifetimePoints?: boolean;
    showVipTiers?: boolean;
    textColor?: string;
  };
}
