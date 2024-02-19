import type {ContainerSettings} from '~/settings/container';
import type {ImageCms, LinkCms} from '~/lib/types';

interface Section {
  aspectRatio: string;
  bgColor: string;
  buttonStyle: string;
  fullWidth: boolean;
  textColor: string;
}

interface Tile {
  image: ImageCms;
  title: string;
  url: string;
}

export interface ThreeTilesCms {
  button: LinkCms;
  heading: string;
  section: Section;
  tiles: Tile[];
  container: ContainerSettings;
}
