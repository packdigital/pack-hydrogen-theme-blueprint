import type {ReactNode} from 'react';

import type {ContainerSettings} from '~/settings/container';
import type {ImageCms, LinkCms} from '~/lib/types';

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
  imageDesktop: ImageCms;
  imageMobile: ImageCms;
  positionDesktop: string;
  positionMobile: string;
}

interface Video {
  autoplay: boolean;
  posterDesktop: {
    src: string;
    aspectRatio: string;
  };
  posterMobile: {
    src: string;
    aspectRatio: string;
  };
  sound: boolean;
  srcDesktop: string;
  srcMobile: string;
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
  sectionVisibility: string;
}

export interface HeroSlideProps {
  aboveTheFold?: boolean;
  isActiveSlide?: boolean;
  isFirstSlide?: boolean;
  slide: Slide;
}

export interface HeroSliderProps {
  aboveTheFold?: boolean;
  slider: Slider;
  slides: Slide[];
}

export interface HeroVideoProps {
  isVisible?: boolean;
  posterSrc?: string;
  videoSrc?: string;
}

export interface HeroContainerProps {
  children: ReactNode;
  cms: HeroCms;
}
