import type {ContainerSettings} from '~/settings/container';

export interface MarkdownCms {
  content: string;
  section: {
    centerAllText: boolean;
    hasXPadding: boolean;
    hasYPadding: boolean;
    maxWidth: string;
    textColor: string;
  };
  container: ContainerSettings;
}
