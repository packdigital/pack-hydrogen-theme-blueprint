import type {ContainerSettings} from '~/settings/container';

export interface MarqueeCms {
  contentItems: {
    text: string;
  }[];
  content: {
    bgColor: string;
    textColor: string;
    font: string;
    uppercase: boolean;
    fontSizeDesktop: string;
    fontSizeTablet: string;
    fontSizeMobile: string;
    letterSpacing: string;
    yPaddingDesktop: boolean;
    yPaddingTablet: boolean;
    yPaddingMobile: boolean;
    spacing: string;
  };
  marquee: {
    direction: 'left' | 'right';
    speed: number;
    pauseOnHover: boolean;
    pauseOnClick: boolean;
    enabledGradient: boolean;
    gradientWidth: number;
  };
  section: {
    hasYPadding: boolean;
  };
  container: ContainerSettings;
}
