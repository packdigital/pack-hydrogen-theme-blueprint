import type {ContainerSettings} from '~/settings/container';
import type {MediaCms, LinkCms} from '~/lib/types';

interface Media {
  title: string;
  videoDesktop: MediaCms;
  posterDesktop: MediaCms;
  aspectDesktop: string;
  videoMobile: MediaCms;
  posterMobile: MediaCms;
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
  posterUrl?: string;
  title: string;
  video: MediaCms;
}
