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

interface Tab {
  tabName: string;
  tiles: Tile[];
}

export interface TabbedThreeTilesCms {
  button: LinkCms;
  heading: string;
  section: Section;
  tabs: Tab[];
  container: ContainerSettings;
}

export interface TabbedThreeTilesTabsProps {
  activeTabIndex: number;
  maxWidthClass: string;
  tabs: Tab[];
  textColor: string;
}
