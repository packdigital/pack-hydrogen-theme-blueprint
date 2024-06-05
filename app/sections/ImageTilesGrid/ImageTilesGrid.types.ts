import type {ContainerSettings} from '~/settings/container';
import type {Crop, ImageCms, LinkCms} from '~/lib/types';

interface Header {
  heading: string;
  subheading: string;
  alignment: string;
}

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

interface ViewportSettings {
  gridCols: string;
  gap: string;
  fullBleed: boolean;
}

interface Section {
  aspectRatio: string;
  desktop: ViewportSettings;
  tablet: ViewportSettings;
  mobile: ViewportSettings;
  textColor: string;
  fullWidth?: boolean;
}

export interface ImageTilesGridCms {
  header: Header;
  content: Content;
  section: Section;
  tiles: Tile[];
  container: ContainerSettings;
}

export interface ImageTilesGridItemProps {
  aspectRatio: string | undefined;
  content: Content;
  tile: Tile;
}
