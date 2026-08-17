import type {ContainerSettings} from '~/settings/container';

export interface RivoReferralCms {
  container: ContainerSettings;
  heading?: string;
  subtext?: string;
  labels?: {
    copiedText?: string;
    copyText?: string;
    emptyMessage?: string;
    signedOutMessage?: string;
    signInText?: string;
  };
  section?: {
    aboveTheFold?: boolean;
    buttonStyle?: string;
    fullWidth?: boolean;
    showReferralList?: boolean;
    textColor?: string;
  };
}
