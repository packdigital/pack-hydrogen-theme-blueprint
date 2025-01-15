import type {ContainerSettings} from '~/settings/container';
import type {
  AspectRatio,
  Crop,
  MediaCms as ImageType,
  LinkCms,
} from '~/lib/types';

interface Image {
  alt: string;
  aspectDesktop: AspectRatio;
  aspectMobile: AspectRatio;
  cropDesktop: Crop;
  cropMobile: Crop;
  imageDesktop: ImageType;
  imageMobile: ImageType;
}

interface Section {
  maxWidth: string;
  enablePadding: boolean;
}

interface Content {
  caption: string;
  link: LinkCms;
}

export interface MediaCms {
  content: Content;
  image: Image;
  section: Section;
  container: ContainerSettings;
}
