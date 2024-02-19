import type {ContainerSettings} from '~/settings/container';
import type {Crop, ImageCms, LinkCms} from '~/lib/types';

interface Content {
  clickableImage?: boolean;
  contentPosition?: string;
  darkOverlay?: boolean;
  hideButtons?: boolean;
  primaryButtonStyle?: string;
  secondaryButtonStyle?: string;
}

interface Tile {
  alt?: string;
  crop?: Crop;
  buttons?: {
    link?: LinkCms;
  }[];
  heading?: string;
  image?: ImageCms;
}

interface Section {
  aspectRatio?: string;
  fullWidth?: boolean;
}

export interface ImageTilesCms {
  content: Content;
  heading?: string;
  subheading?: string;
  section: Section;
  tiles: Tile[];
  container: ContainerSettings;
}

export interface ImageTileProps {
  aspectRatio: string | undefined;
  content: Content;
  tile: Tile;
}
