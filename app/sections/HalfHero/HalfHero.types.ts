import type {Crop, MediaCms} from '~/lib/types';
import type {ContainerSettings} from '~/settings/container';

interface Image {
  alt: string;
  imageDesktop: MediaCms;
  imageMobile: MediaCms;
  cropDesktop: Crop;
  cropMobile: Crop;
}

interface Video {
  autoplay: boolean;
  posterDesktop: MediaCms;
  posterMobile: MediaCms;
  sound: boolean;
  videoDesktop: MediaCms;
  videoMobile: MediaCms;
}

interface Media {
  aspectDesktop: string;
  aspectMobile: string;
  fill: boolean;
  image: Image;
  mediaOrderDesktop: string;
  mediaOrderMobile: string;
  mediaWidthRatio: string;
  video: Video;
}

interface Content {
  alignmentDesktop: string;
  alignmentMobile: string;
  buttons: Record<string, any>[];
  color: string;
  heading: string;
  maxWidthDesktop: string;
  subtext: string;
  superheading: string;
}

interface Section {
  aboveTheFold: boolean;
  fullBleed: boolean;
  fullWidth: boolean;
  verticalPadding: boolean;
}

export interface HalfHeroCms {
  content: Content;
  media: Media;
  section: Section;
  container: ContainerSettings;
}

export interface HalfHeroMediaProps {
  aboveTheFold?: boolean;
  aspectDesktop: string;
  aspectMobile: string;
  media: Media;
  videoAlt?: string;
}

export interface HalfHeroContentProps {
  aboveTheFold?: boolean;
  content?: Content;
  fullBleed?: boolean;
  mediaOrderDesktop?: string;
}

export interface HalfHeroVideoProps {
  autoplay?: boolean;
  posterUrl?: string;
  sound?: boolean;
  video: MediaCms;
  videoAlt?: string;
}
