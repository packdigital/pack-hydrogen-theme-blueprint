import type {ContainerSettings} from '~/settings/container';

interface Media {
  embed: string;
  aspectRatio: string;
}

interface Section {
  maxWidth: string;
  enableYPadding: boolean;
  enableXPadding: boolean;
}

export interface VideoEmbedCms {
  media: Media;
  section: Section;
  container: ContainerSettings;
}
