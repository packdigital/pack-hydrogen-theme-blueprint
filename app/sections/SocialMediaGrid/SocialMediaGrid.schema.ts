import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Featured Media',
    label: 'Social Media Grid',
    key: 'social-media-grid',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/social-feed-preview.jpg?v=1675730338',
    fields: [
      {
        label: 'Media',
        name: 'media',
        description: 'Grid requires four media items',
        component: 'group-list',
        itemProps: {
          label: '{{item.alt}}',
        },
        validate: {
          maxItems: 4,
        },
        fields: [
          {
            label: 'Media Alt',
            name: 'alt',
            component: 'text',
            description:
              'Alt text set in media manager for selected image(s) will take priority. Re-add image(s) if alt text was set in media manager after selection.',
          },
          {
            label: 'Image',
            name: 'image',
            component: 'image',
          },
          {
            label: 'Video',
            name: 'video',
            component: 'image',
            description:
              'If a video is selected, the image will be optional and used as the video poster (e.g. first frame of the video)',
          },
          {
            label: 'Platform',
            name: 'platform',
            component: 'select',
            options: [
              {label: 'Facebook', value: 'facebook'},
              {label: 'Instagram', value: 'instagram'},
              {label: 'Pinterest', value: 'pinterest'},
              {label: 'TikTok', value: 'tiktok'},
              {label: 'Twitter', value: 'twitter'},
              {label: 'Vimeo', value: 'vimeo'},
              {label: 'YouTube', value: 'youtube'},
            ],
          },
          {
            label: 'Social Post URL',
            name: 'url',
            component: 'text',
          },
        ],
        defaultItem: {
          alt: 'Man in white short sleeve shirt',
          image: {
            url: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/kenzie-kraft-9QW52RyBLao-unsplash.jpg?v=1672348135',
          },
          platform: 'instagram',
          url: 'https://www.instagram.com',
        },
        defaultValue: [
          {
            alt: 'Man in white short sleeve shirt',
            image: {
              url: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/kenzie-kraft-9QW52RyBLao-unsplash.jpg?v=1672348135',
            },
            platform: 'instagram',
            url: 'https://www.instagram.com',
          },
          {
            alt: 'Menswear everyday carry',
            image: {
              url: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/nordwood-themes-Nv4QHkTVEaI-unsplash-2.jpg?v=1672787938',
            },
            platform: 'instagram',
            url: 'https://www.instagram.com',
          },
          {
            alt: 'Man in white t-shirt leaning against wall',
            image: {
              url: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/mad-rabbit-tattoo-X0Ob-bhTdz8-unsplash.jpg?v=1672787932',
            },
            platform: 'instagram',
            url: 'https://www.instagram.com',
          },
          {
            alt: 'Rack of neutral tone shirts',
            image: {
              url: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/fernando-lavin-fi5YSQfxbVk-unsplash.jpg?v=1672787923',
            },
            platform: 'instagram',
            url: 'https://www.instagram.com',
          },
        ],
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Full width, full bleed, media aspect ratio, gap spacing',
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
          },
          {
            label: 'Full Bleed',
            name: 'fullBleed',
            component: 'toggle',
            description: 'Removes padding of this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Image Aspect Ratio',
            name: 'aspectRatio',
            component: 'select',
            options: [
              {label: '1:1', value: 'aspect-[1/1]'},
              {label: '9:16', value: 'aspect-[9/16]'},
            ],
          },
          {
            label: 'Grid Gap Spacing',
            name: 'gridGap',
            component: 'select',
            options: [
              {label: '0px', value: 'gap-[0px]'},
              {label: '1px', value: 'gap-[1px]'},
              {label: '2px', value: 'gap-[2px]'},
              {label: '4px', value: 'gap-[4px]'},
              {label: '6px', value: 'gap-[6px]'},
              {label: '8px', value: 'gap-[8px]'},
              {label: '10px', value: 'gap-[10px]'},
              {label: '12px', value: 'gap-[12px]'},
              {label: '14px', value: 'gap-[14px]'},
              {label: '16px', value: 'gap-[16px]'},
              {label: '20px', value: 'gap-[20px]'},
              {label: '24px', value: 'gap-[24px]'},
            ],
          },
        ],
        defaultValue: {
          fullWidth: false,
          fullBleed: true,
          aspectRatio: 'aspect-[1/1]',
          gridGap: 'gap-[1px]',
        },
      },
      containerSettings(),
    ],
  };
}
