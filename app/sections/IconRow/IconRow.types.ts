import type {ContainerSettings} from '~/settings/container';
import type {MediaCms} from '~/lib/types';

interface Icon {
  icon: string;
  image?: MediaCms;
  alt?: string;
  label?: string;
}

interface Section {
  fullWidth?: boolean;
  textColor?: string;
  iconColor?: string;
}

export interface IconRowCms {
  heading?: string;
  icons: Icon[];
  section: Section;
  subtext?: string;
  container: ContainerSettings;
}
