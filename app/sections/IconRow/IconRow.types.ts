import type {ContainerSettings} from '~/settings/container';
import type {ImageCms} from '~/lib/types';

interface Icon {
  icon: string;
  image?: ImageCms;
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
