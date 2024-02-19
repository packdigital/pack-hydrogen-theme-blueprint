import type {ContainerSettings} from '~/settings/container';
import type {ImageCms, LinkCms} from '~/lib/types';

interface Media {
  title: string;
  srcDesktop: string;
  posterDesktop: ImageCms;
  aspectDesktop: string;
  srcMobile: string;
  posterMobile: ImageCms;
  aspectMobile: string;
}

interface Section {
  maxWidth: string;
  enableYPadding: boolean;
  enableXPadding: boolean;
}

interface Content {
  link: LinkCms;
}

interface Play {
  autoplay: boolean;
  controls: boolean;
  loop: boolean;
  pauseAndPlay: boolean;
  sound: boolean;
}

export interface VideoCms {
  content: Content;
  media: Media;
  play: Play;
  section: Section;
  container: ContainerSettings;
}

export interface VideoElementProps {
  playOptions: Play;
  posterSrc: string;
  title: string;
  videoSrc: string;
}
