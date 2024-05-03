import type {ContainerSettings} from '~/settings/container';
import type {LinkCms} from '~/lib/types';

interface Section {
  aboveTheFold: boolean;
  fullWidth: boolean;
  textColor: string;
}

interface Button {
  link: LinkCms;
  style: string;
}

export interface TextBlockCms {
  buttons: Button[];
  heading: string;
  section: Section;
  subtext: string;
  container: ContainerSettings;
}
