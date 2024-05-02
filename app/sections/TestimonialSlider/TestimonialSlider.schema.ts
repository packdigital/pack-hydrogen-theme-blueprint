import {COLORS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Slider',
    label: 'Testimonial Slider',
    key: 'testimonial-slider',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/testimonial-slider-preview.jpg?v=1675730345',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Testimonial Slider Heading',
      },
      {
        label: 'Testimonial Slides',
        name: 'testimonialSlides',
        component: 'group-list',
        itemProps: {
          label: '{{item.title}}',
        },
        fields: [
          {
            label: 'Title',
            name: 'title',
            component: 'text',
          },
          {
            label: 'Body',
            name: 'body',
            component: 'textarea',
          },
          {
            label: 'Author',
            name: 'author',
            component: 'text',
          },
          {
            label: 'Rating',
            name: 'rating',
            component: 'select',
            options: [
              {label: '1', value: '1'},
              {label: '1.5', value: '1.5'},
              {label: '2', value: '2'},
              {label: '2.5', value: '2.5'},
              {label: '3', value: '3'},
              {label: '3.5', value: '3.5'},
              {label: '4', value: '4'},
              {label: '4.5', value: '4.5'},
              {label: '5', value: '5'},
            ],
            defaultValue: '5',
          },
        ],
        defaultItem: {
          title: 'Fermentum fusce',
          body: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
          author: '– John Doe',
          rating: '5',
        },
        defaultValue: [
          {
            title: 'Fermentum fusce',
            body: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
            author: '– John Doe',
            rating: '5',
          },
          {
            title: 'Lorem ipsum dolor',
            body: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
            author: '– John Doe',
            rating: '5',
          },
          {
            title: 'Sed ut perspiciatis',
            body: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
            author: '– John Doe',
            rating: '5',
          },
        ],
      },
      {
        label: 'Link',
        name: 'link',
        component: 'link',
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Full width, text color, bullet color, star color',
        fields: [
          {
            label: 'Full Width',
            name: 'fullWidth',
            component: 'toggle',
            description: 'Removes max width of this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
            defaultValue: false,
          },
          {
            label: 'Text Color',
            name: 'textColor',
            component: 'select',
            options: COLORS,
          },
          {
            label: 'Slider Pagination Bullet Color',
            name: 'sliderPaginationBulletColor',
            component: 'select',
            options: COLORS,
          },
          {
            label: 'Review Star Color',
            name: 'reviewStarColor',
            component: 'select',
            options: COLORS,
          },
        ],
        defaultValue: {
          fullWidth: false,
          textColor: 'var(--white)',
          sliderPaginationBulletColor: 'var(--white)',
          reviewStarColor: 'var(--accent1)',
        },
      },
      containerSettings(),
    ],
  };
}
