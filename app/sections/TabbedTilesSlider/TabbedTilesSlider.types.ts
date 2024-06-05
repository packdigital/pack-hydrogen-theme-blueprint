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

interface Tab {
  tabName: string;
  tiles: Tile[];
}

export interface TabbedTilesSliderCms {
  header: Header;
  button: LinkCms;
  section: Section;
  tabs: Tab[];
  container: ContainerSettings;
}

export interface TabbedTilesSliderTabsProps {
  activeTabIndex: number;
  maxWidthClass: string;
  tabs: Tab[];
  textColor: string;
}
