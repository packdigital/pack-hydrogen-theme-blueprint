import type {ContainerSettings} from '~/settings/container';

interface Content {
  contentAlign?: string;
  textAlign?: string;
}

interface Section {
  hasXPadding?: boolean;
  hasYPadding?: boolean;
  maxWidth?: string;
  textColor?: string;
}

export interface HtmlCms {
  content: Content;
  html: string;
  section: Section;
  container: ContainerSettings;
}
