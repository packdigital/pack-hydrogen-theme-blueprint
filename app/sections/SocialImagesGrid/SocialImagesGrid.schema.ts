import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Media',
    label: 'Social Images Grid',
    key: 'social-images-grid',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/social-feed-preview.jpg?v=1675730338',
    fields: [
      {
        label: 'Images',
        name: 'images',
        description: 'Grid requires four images',
        component: 'group-list',
        itemProps: {
          label: '{{item.alt}}',
        },
        validate: {
          maxItems: 4,
        },
        fields: [
          {
            label: 'Image Alt',
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
            src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/kenzie-kraft-9QW52RyBLao-unsplash.jpg?v=1672348135',
          },
          platform: 'instagram',
          url: 'https://www.instagram.com',
        },
        defaultValue: [
          {
            alt: 'Man in white short sleeve shirt',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/kenzie-kraft-9QW52RyBLao-unsplash.jpg?v=1672348135',
            },
            platform: 'instagram',
            url: 'https://www.instagram.com',
          },
          {
            alt: 'Menswear everyday carry',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/nordwood-themes-Nv4QHkTVEaI-unsplash-2.jpg?v=1672787938',
            },
            platform: 'instagram',
            url: 'https://www.instagram.com',
          },
          {
            alt: 'Man in white t-shirt leaning against wall',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/mad-rabbit-tattoo-X0Ob-bhTdz8-unsplash.jpg?v=1672787932',
            },
            platform: 'instagram',
            url: 'https://www.instagram.com',
          },
          {
            alt: 'Rack of neutral tone shirts',
            image: {
              src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/fernando-lavin-fi5YSQfxbVk-unsplash.jpg?v=1672787923',
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
        description: 'Full width, full bleed',
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
        ],
        defaultValue: {
          fullWidth: false,
          fullBleed: true,
        },
      },
      containerSettings(),
    ],
  };
}
