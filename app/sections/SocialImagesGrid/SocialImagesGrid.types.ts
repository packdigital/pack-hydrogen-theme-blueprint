import type {ContainerSettings} from '~/settings/container';
import type {ImageCms} from '~/lib/types';

interface Image {
  alt: string;
  image: ImageCms;
  platform: string;
  url: string;
}

interface Section {
  fullBleed: boolean;
  fullWidth: boolean;
}

export interface SocialImagesGridCms {
  images: Image[];
  section: Section;
  container: ContainerSettings;
}
