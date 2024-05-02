import type {ContainerSettings} from '~/settings/container';
import type {LinkCms} from '~/lib/types';

interface Section {
  fullWidth: boolean;
  reviewStarColor: string;
  sliderPaginationBulletColor: string;
  textColor: string;
}

interface Slide {
  title: string;
  body: string;
  author: string;
  rating: string;
}

export interface TestimonialSliderCms {
  heading: string;
  link: LinkCms;
  section: Section;
  testimonialSlides: Slide[];
  container: ContainerSettings;
}
