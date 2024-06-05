import type {Crop, ImageCms, LinkCms} from '~/lib/types';
import type {ContainerSettings} from '~/settings/container';

interface Header {
  heading: string;
  subheading: string;
  alignment: string;
}

interface Section {
  aspectRatio: string;
  textColor: string;
  textAlign: string;
  tileHeadingSize: string;
  fullWidth: boolean;
}

interface Tile {
  alt: string;
  crop: Crop;
  description: string;
  heading: string;
  image: ImageCms;
  link: LinkCms;
}

export interface TilesStackCms {
  header: Header;
  section: Section;
  tiles: Tile[];
  container: ContainerSettings;
}
