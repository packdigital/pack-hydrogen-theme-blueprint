import type {ReactNode} from 'react';

import type {ContainerSettings} from '~/settings/container';
import type {ImageCms, LinkCms} from '~/lib/types';

export interface BannerCms {
  image: {
    alt: string;
    imageDesktop: ImageCms;
    positionDesktop: string;
    imageMobile: ImageCms;
    positionMobile: string;
  };
  text: {
    heading: string;
    subheading: string;
    color: string;
    buttons: {
      link: LinkCms;
      style: string;
    }[];
  };
  content: {
    darkOverlay: boolean;
    positionDesktop: string;
    alignmentDesktop: string;
    maxWidthDesktop: string;
    positionMobile: string;
    alignmentMobile: string;
    maxWidthMobile: string;
  };
  section: {
    aboveTheFold?: boolean;
    fullWidth: boolean;
    fullBleed: boolean;
    desktop: {
      heightType: string;
      staticHeight: string;
      aspectRatio: string;
      minHeight: string;
      maxHeight: string;
    };
    mobile: {
      heightType: string;
      staticHeight: string;
      aspectRatio: string;
      minHeight: string;
      maxHeight: string;
    };
  };
  container: ContainerSettings;
  sectionName: string;
  sectionVisibility: string;
}

export interface BannerContentProps {
  aboveTheFold: boolean | undefined;
  content: BannerCms['content'];
  text: BannerCms['text'];
}

export interface BannerContainerProps {
  children: ReactNode;
  cms: BannerCms;
}
