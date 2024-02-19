import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Media',
    label: 'Video',
    key: 'video',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/video-section-preview-image.jpg?v=1681791343',
    fields: [
      {
        label: 'Media Settings',
        name: 'media',
        component: 'group',
        description: 'Video url, poster image, aspect ratio',
        fields: [
          {
            label: 'Video Title',
            name: 'title',
            component: 'text',
          },
          {
            label: 'Video URL (tablet/desktop)',
            name: 'srcDesktop',
            component: 'text',
            description: 'Must be a direct link, not a share link',
          },
          {
            label: 'Poster Image (tablet/desktop)',
            name: 'posterDesktop',
            component: 'image',
            description: 'First frame of video while video loads',
          },
          {
            label: 'Video Aspect Ratio (tablet/desktop)',
            name: 'aspectDesktop',
            component: 'select',
            options: [
              {label: '3:1', value: 'md:aspect-[3/1]'},
              {label: '5:2', value: 'md:aspect-[5/2]'},
              {label: '2:1', value: 'md:aspect-[2/1]'},
              {label: '16:9', value: 'md:aspect-[16/9]'},
              {label: '3:2', value: 'md:aspect-[3/2]'},
              {label: '4:3', value: 'md:aspect-[4/3]'},
              {label: '5:4', value: 'md:aspect-[5/4]'},
              {label: '1:1', value: 'md:aspect-[1/1]'},
              {label: '4:5', value: 'md:aspect-[4/5]'},
              {label: '3:4', value: 'md:aspect-[3/4]'},
              {label: '2:3', value: 'md:aspect-[2/3]'},
              {label: '9:16', value: 'md:aspect-[9/16]'},
            ],
          },
          {
            label: 'Video URL (mobile)',
            name: 'srcMobile',
            component: 'text',
            description: 'Must be a direct link, not a share link',
          },
          {
            label: 'Poster Image (mobile)',
            name: 'posterMobile',
            component: 'image',
            description: 'First frame of video while video loads',
          },
          {
            label: 'Video Aspect Ratio (mobile)',
            name: 'aspectMobile',
            component: 'select',
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
          title: 'Video content',
          aspectDesktop: 'md:aspect-[16/9]',
          aspectMobile: 'aspect-[16/9]',
        },
      },
      {
        label: 'Play Settings',
        name: 'play',
        component: 'group',
        description: 'Autoplay, loop, pause and play, sound, controls',
        fields: [
          {
            label: 'Autoplay',
            name: 'autoplay',
            component: 'toggle',
            description: 'Autoplays video when in view',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Loop',
            name: 'loop',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Pause & Play',
            name: 'pauseAndPlay',
            component: 'toggle',
            description: 'Enables pause and play button',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Sound',
            name: 'sound',
            component: 'toggle',
            description: 'Only applicable if autoplay is off',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Controls',
            name: 'controls',
            component: 'toggle',
            description: 'Shows native controls for video',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          autoplay: true,
          loop: true,
          pauseAndPlay: true,
          sound: false,
          controls: false,
        },
      },
      {
        label: 'Content Settings',
        name: 'content',
        component: 'group',
        description: 'Clickable link',
        fields: [
          {
            label: 'Link',
            name: 'link',
            component: 'link',
            description:
              'Optional link to make video clickable. Only applicable if video controls and pause and play are off',
          },
        ],
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
          maxWidth: 'max-w-full',
          enableYPadding: false,
          enableXPadding: false,
        },
      },
      containerSettings(),
    ],
  };
}
