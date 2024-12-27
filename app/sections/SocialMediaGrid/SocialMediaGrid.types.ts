import type {ContainerSettings} from '~/settings/container';
import type {ImageCms} from '~/lib/types';

interface Media {
  alt: string;
  image: ImageCms;
  video: ImageCms;
  platform: string;
  url: string;
}

interface Section {
  fullBleed: boolean;
  fullWidth: boolean;
  aspectRatio: string;
  gridGap: string;
}

export interface SocialMediaGridCms {
  media: Media[];
  section: Section;
  container: ContainerSettings;
}
