import type {ContainerSettings} from '~/settings/container';

export interface RivoRewardsCms {
  container: ContainerSettings;
  heading?: string;
  subtext?: string;
  labels?: {
    emptyMessage?: string;
    redeemText?: string;
    signedOutMessage?: string;
    signInText?: string;
    viewCartText?: string;
  };
  section?: {
    aboveTheFold?: boolean;
    buttonStyle?: string;
    fullWidth?: boolean;
    gridColumns?: string;
    openCartOnRedeem?: boolean;
    showBalance?: boolean;
    textColor?: string;
  };
}
