import type {Crop, ImageCms, LinkCms} from '~/lib/types';
import type {ContainerSettings} from '~/settings/container';

interface Section {
  aspectRatio: string;
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

export interface TwoTilesCms {
  section: Section;
  tiles: Tile[];
  container: ContainerSettings;
}
