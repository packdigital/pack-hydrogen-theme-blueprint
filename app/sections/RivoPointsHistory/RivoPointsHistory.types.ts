import type {ContainerSettings} from '~/settings/container';

export interface RivoPointsHistoryCms {
  container: ContainerSettings;
  heading?: string;
  labels?: {
    emptyMessage?: string;
    signedOutMessage?: string;
    signInText?: string;
  };
  section?: {
    fullWidth?: boolean;
    ledgerType?: 'points' | 'credits';
    limit?: string | number;
    textColor?: string;
  };
}
