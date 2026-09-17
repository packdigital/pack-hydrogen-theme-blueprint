import type {ContainerSettings} from '~/settings/container';

export interface RivoPointsHistoryCms {
  container: ContainerSettings;
  heading?: string;
  labels?: {
    expiryWarning?: string;
    pendingText?: string;
    showMoreText?: string;
    emptyMessage?: string;
    signedOutMessage?: string;
    signInText?: string;
  };
  section?: {
    fullWidth?: boolean;
    limit?: string | number;
    textColor?: string;
  };
}
