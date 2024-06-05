import type {ContainerSettings} from '~/settings/container';
import type {ImageCms, LinkCms} from '~/lib/types';

interface Header {
  heading: string;
  subheading: string;
  alignment: string;
}

interface Content {
  clickableImage: boolean;
  contentPosition: string;
  contentAlign: string;
  darkOverlay: boolean;
}

interface Tile {
  alt: string;
  image: ImageCms;
  positionDesktop: string;
  positionMobile: string;
  heading: string;
  subheading: string;
  buttons: {
    link: LinkCms;
    style: string;
  }[];
  hideButton: boolean;
}

interface PrimaryTile extends Tile {
  placementDesktop: string;
  placementMobile: string;
  aspectRatioDesktop: string;
  aspectRatioMobile: string;
}

interface GridTile extends Tile {
  aspectRatioMobile: string;
}

interface Grid {
  gridLayout: string;
  tiles: GridTile[];
}

interface ViewportSettings {
  gap: string;
  fullBleed: boolean;
}

interface Section {
  desktop: ViewportSettings;
  tablet: ViewportSettings;
  mobile: ViewportSettings;
  textColor: string;
  fullWidth: boolean;
}

export interface ImageTilesMosaicCms {
  primary: PrimaryTile;
  grid: Grid;
  header: Header;
  content: Content;
  section: Section;
  container: ContainerSettings;
}

export interface ImageTilesMosaicItemProps {
  content: Content;
  tile: Tile;
}
