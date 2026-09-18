import type {ContainerSettings} from '~/settings/container';

export interface RivoRewardsCms {
  container: ContainerSettings;
  heading?: string;
  subtext?: string;
  labels?: {
    cancelText?: string;
    confirmText?: string;
    emptyMessage?: string;
    redeemText?: string;
    signedOutMessage?: string;
    signInText?: string;
    unusedHeading?: string;
    unusedSubtext?: string;
    viewCartText?: string;
  };
  section?: {
    anchorId?: string;
    aboveTheFold?: boolean;
    buttonStyle?: string;
    fullWidth?: boolean;
    gridColumns?: string;
    openCartOnRedeem?: boolean;
    showBalance?: boolean;
    showUnusedRewards?: boolean;
    textColor?: string;
  };
}
