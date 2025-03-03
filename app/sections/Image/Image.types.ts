import type {ContainerSettings} from '~/settings/container';
import type {
  AspectRatio,
  Crop,
  MediaCms as MediaType,
  LinkCms,
} from '~/lib/types';

interface Image {
  alt: string;
  aspectDesktop: AspectRatio;
  aspectMobile: AspectRatio;
  cropDesktop: Crop;
  cropMobile: Crop;
  imageDesktop: MediaType;
  imageMobile: MediaType;
}

interface Section {
  maxWidth: string;
  enablePadding: boolean;
}

interface Content {
  caption: string;
  link: LinkCms;
}

export interface ImageCms {
  content: Content;
  image: Image;
  section: Section;
  container: ContainerSettings;
}
