import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Media',
    label: 'Video Embed',
    key: 'video-embed',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/video-section-preview-image.jpg?v=1681791343',
    fields: [
      {
        label: 'Media Settings',
        name: 'media',
        component: 'group',
        description: 'Video embed, aspect ratio',
        fields: [
          {
            label: 'Video Embed (HTML)',
            name: 'embed',
            component: 'html',
          },
          {
            label: 'Video Aspect Ratio',
            name: 'aspectRatio',
            component: 'select',
            description: `Preserves the video's aspect ratio before it loads when in view`,
            options: [
              {label: '3:1', value: 'aspect-[3/1]'},
              {label: '5:2', value: 'aspect-[5/2]'},
              {label: '2:1', value: 'aspect-[2/1]'},
              {label: '16:9', value: 'aspect-[16/9]'},
              {label: '3:2', value: 'aspect-[3/2]'},
              {label: '4:3', value: 'aspect-[4/3]'},
              {label: '5:4', value: 'aspect-[5/4]'},
              {label: '1:1', value: 'aspect-[1/1]'},
              {label: '4:5', value: 'aspect-[4/5]'},
              {label: '3:4', value: 'aspect-[3/4]'},
              {label: '2:3', value: 'aspect-[2/3]'},
              {label: '9:16', value: 'aspect-[9/16]'},
            ],
          },
        ],
        defaultValue: {
          aspectRatio: 'aspect-[16/9]',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Max width, padding',
        fields: [
          {
            label: 'Max Width',
            name: 'maxWidth',
            component: 'select',
            options: [
              {
                label: 'Narrow',
                value: 'max-w-[30rem]',
              },
              {
                label: 'Medium Narrow',
                value: 'max-w-[45rem]',
              },
              {
                label: 'Medium',
                value: 'max-w-[60rem]',
              },
              {
                label: 'Medium Wide',
                value: 'max-w-[75rem]',
              },
              {
                label: 'Wide',
                value: 'max-w-[90rem]',
              },
              {label: 'Full', value: 'max-w-full'},
            ],
          },
          {
            label: 'Enable Vertical Padding',
            name: 'enableYPadding',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Enable Horizontal Padding',
            name: 'enableXPadding',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          maxWidth: 'max-w-[90rem]',
          enableYPadding: true,
          enableXPadding: true,
        },
      },
      containerSettings(),
    ],
  };
}
