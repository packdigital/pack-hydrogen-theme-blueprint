import {ProductSliderSlide} from './ProductSlider.types';

export const sliderMock: ProductSliderSlide[] = [
  {
    imageLocation: 'left',
    imageDesktop: {
      url: 'https://cdn.shopify.com/s/files/1/0739/0258/8119/files/JigglePets_5_4_in_rows.jpg?v=1746667887',
    },
    imageAltText: 'Slide 1 Image',
    title: 'Slide 1 Title',
    title2: 'Slide 1 Subtitle',
    tagline: 'Slide 1 Tagline',
    description: 'This is the description for slide 1.',
    featureOrientation: 'vertical',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    buttons: [],
  },
  {
    imageLocation: 'right',
    imageDesktop: {
      url: 'https://cdn.shopify.com/s/files/1/0739/0258/8119/files/JigglePets_5_4_in_rows.jpg?v=1746667887',
    },
    imageAltText: 'Slide 2 Image',
    title: 'Slide 2 Title',
    title2: 'Slide 2 Subtitle',
    tagline: 'Slide 2 Tagline',
    description: 'This is the description for slide 2.',
    featureOrientation: 'horizontal',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    buttons: [],
  },
  {
    imageLocation: 'left',
    imageDesktop: {
      url: 'https://cdn.shopify.com/s/files/1/0739/0258/8119/files/JigglePets_5_4_in_rows.jpg?v=1746667887',
    },
    imageAltText: 'Slide 3 Image',
    title: 'Slide 3 Title',
    title2: 'Slide 3 Subtitle',
    tagline: 'Slide 3 Tagline',
    description:
      '<p class="text-h3">This is the description for slide 2. Lorem Dipsum This is the description for slide 2.</p>',
    featureOrientation: 'horizontal',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
      'Feature 1',
      'Feature 2',
      'Feature 3',
    ],
    buttons: [],
  },
];
