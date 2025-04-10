import type {ContainerSettings} from '~/settings/container';

export interface RichTextCms {
  richtext: string;
  section: {
    hasXPadding?: boolean;
    hasYPadding?: boolean;
    maxWidth?: string;
    textColor?: string;
  };
  container: ContainerSettings;
}
