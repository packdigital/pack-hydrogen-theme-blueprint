export interface ProductSliderCms {
  heading: string;
  section: {
    fullWidth: boolean;
  };
  slides: {
    imageLocation: 'left' | 'right';
    title?: string;
    title2?: string;
    tagline?: string;
    description?: string;
  }[];
}
