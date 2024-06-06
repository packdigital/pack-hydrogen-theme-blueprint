import type {ContainerSettings} from '~/settings/container';
import type {ImageCms, LinkCms} from '~/lib/types';

interface Header {
  heading: string;
  subheading: string;
  alignment: string;
}

interface Section {
  tilesPerViewDesktop: number;
  tilesPerViewTablet: number;
  tilesPerViewMobile: number;
  aspectRatio: string;
  buttonStyle: string;
  fullWidth: boolean;
  textColor: string;
  textAlign: string;
  tileHeadingSize: string;
}

interface Tile {
  image: ImageCms;
  title: string;
  url: string;
}

export interface TilesSliderCms {
  header: Header;
  button: LinkCms;
  section: Section;
  tiles: Tile[];
  container: ContainerSettings;
}
