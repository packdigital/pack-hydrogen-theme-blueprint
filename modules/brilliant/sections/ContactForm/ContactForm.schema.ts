import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Page',
    label: 'Brilliant - Contact Form',
    key: 'brilliant-contact-form',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0739/0258/8119/files/contact_form_screenshot.png?v=1746486287',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Contact Form Heading',
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Full width',
        fields: [
          {
            label: 'Full Width',
            name: 'fullWidth',
            component: 'toggle',
            description: 'Removes max width from contained styles',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
      },
      containerSettings(),
    ],
  };
}
