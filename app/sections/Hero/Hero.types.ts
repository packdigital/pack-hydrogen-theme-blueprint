import type {ReactNode} from 'react';

import type {ContainerSettings} from '~/settings/container';
import type {MediaCms, LinkCms} from '~/lib/types';

interface Section {
  aboveTheFold: boolean;
  desktop: {
    aspectRatio: string;
    heightType: string;
    minHeight: string;
    maxHeight: string;
    staticHeight: string;
  };
  mobile: {
    aspectRatio: string;
    heightType: string;
    minHeight: string;
    maxHeight: string;
    staticHeight: string;
  };
  fullWidth: boolean;
  fullBleed: boolean;
}

interface Text {
  colorDesktop: string;
  colorMobile: string;
  heading: string;
  hideHeadingDesktop: boolean;
  hideHeadingMobile: boolean;
  subheading: string;
  superheading: string;
}

interface Content {
  alignmentDesktop: string;
  alignmentMobile: string;
  darkOverlay: boolean;
  maxWidthDesktop: string;
  maxWidthMobile: string;
  positionDesktop: string;
  positionMobile: string;
}

interface ButtonItem {
  link: LinkCms;
  style: string;
}

interface Button {
  buttons: ButtonItem[];
  clickableSlide: boolean;
  hideButtonsDesktop: boolean;
  hideButtonsMobile: boolean;
}

interface Image {
  alt: string;
  imageDesktop: MediaCms;
  imageMobile: MediaCms;
  positionDesktop: string;
  positionMobile: string;
}

interface Video {
  autoplay: boolean;
  posterDesktop: MediaCms;
  posterMobile: MediaCms;
  sound: boolean;
  videoDesktop: MediaCms;
  videoMobile: MediaCms;
}

interface Slider {
  activeBulletColor: string;
  autoplay: boolean;
  delay: number;
  effect: string;
  pagination: boolean;
}

interface Slide {
  button: Button;
  content: Content;
  image: Image;
  text: Text;
  video: Video;
}

export interface HeroCms {
  section: Section;
  slider: Slider;
  slides: Slide[];
  container: ContainerSettings;
  sectionName: string;
}

export interface HeroSlideProps {
  aboveTheFold?: boolean;
  index: number;
  isActiveSlide?: boolean;
  isFirstSlide?: boolean;
  sectionId: string;
  slide: Slide;
}

export interface HeroSliderProps {
  aboveTheFold?: boolean;
  sectionId: string;
  slider: Slider;
  slides: Slide[];
}

export interface HeroVideoProps {
  isVisible?: boolean;
  posterUrl?: string;
  video?: MediaCms;
}

export interface HeroContainerProps {
  children: ReactNode;
  cms: HeroCms;
  sectionId: string;
}
