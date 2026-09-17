import type {ContainerSettings} from '~/settings/container';

export interface RivoPotentialPointsCms {
  container: ContainerSettings;
  /** `{{points}}` is replaced with the calculated amount. */
  heading?: string;
  subtext?: string;
  image?: {url?: string; altText?: string};
  section?: {
    bgColor?: string;
    /**
     * Rivo's `logged_out_only`: hide the panel from signed-in customers, who
     * already know the program.
     */
    loggedOutOnly?: boolean;
    textColor?: string;
  };
}
