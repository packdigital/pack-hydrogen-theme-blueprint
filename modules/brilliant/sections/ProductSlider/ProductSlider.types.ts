export interface ProductSliderCms {
  heading: string;
  section: {
    fullWidth: boolean;
  };
  slides: {
    design: 'default' | 'fullBackground';
    title?: string;
    title2?: string;
    tagline?: string;
  }[];
}
