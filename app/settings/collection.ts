import type {MediaCms, LinkCms} from '~/lib/types';

import {COLOR_PICKER_DEFAULTS, COLOR_SCHEMA_DEFAULT_VALUE} from './common';

interface PromoTile {
  position: number;
  aspectRatio: string;
  link: LinkCms;
  background: {
    bgColor: string;
    alt: string;
    media: MediaCms;
    videoPoster: MediaCms;
    darkOverlay: boolean;
  };
  text: {
    heading: string;
    subtext: string;
    textColor: string;
  };
}

export interface CollectionSettings {
  filters: {
    enabled: boolean;
    disabledByHandle: string[];
    showCount: boolean;
    sticky: boolean;
    optionsMaxCount: number;
    showMoreCount: number;
  };
  pagination: {
    resultsPerPage: number;
    loadPreviousText: string;
    loadMoreText: string;
    buttonStyle: string;
  };
  productItem: {
    enabledStarRating: boolean;
    enabledColorSelector: boolean;
    enabledColorNameOnHover: boolean;
    enabledQuickShop: boolean;
    quickShopMobileHidden: boolean;
    quickShopMultiText: string;
    quickShopSingleText: string;
  };
  promotion: {
    campaigns: {
      enabled: boolean;
      name: string;
      promoTiles: PromoTile[];
      collections: string[];
    }[];
  };
  sort: {
    enabled: boolean;
    defaultLabel: string;
    bestSellingLabel: string;
    highToLowLabel: string;
    lowToHighLabel: string;
    aToZLabel: string;
    zToALabel: string;
    newestLabel: string;
    oldestLabel: string;
  };
}

export default {
  label: 'Collection',
  name: 'collection',
  component: 'group',
  description: 'Filters, sort, pagination, product item, promotion',
  fields: [
    {
      label: 'Filters',
      name: 'filters',
      component: 'group',
      description:
        'Enable, disable by collection handle, show option count, sticky to top, options max count',
      fields: [
        {
          label: 'Enable',
          name: 'enabled',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
          defaultValue: true,
        },
        {
          label: 'Disable By Handle',
          name: 'disabledByHandle',
          component: 'tags',
          description: 'Target collections by its handle to disable filters',
        },
        {
          label: 'Show Option Count',
          name: 'showCount',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
          defaultValue: true,
        },
        {
          label: 'Sticky To Top',
          name: 'sticky',
          component: 'toggle',
          description: 'Sticky to top of left column on tablet/desktop',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
          defaultValue: true,
        },
        {
          label: 'Options Max Count',
          name: 'optionsMaxCount',
          component: 'number',
          description:
            'Initial number of options to show per filter. Remaining options will be hidden behind a "more" button',
          defaultValue: 6,
        },
        {
          label: 'Show More Count',
          name: 'showMoreCount',
          component: 'number',
          description:
            'Number of new options to show when clicking the "more" button',
          defaultValue: 10,
        },
      ],
    },
    {
      label: 'Pagination',
      name: 'pagination',
      component: 'group',
      description: 'Products per load, load text',
      fields: [
        {
          label: 'Products Per Load',
          name: 'resultsPerPage',
          component: 'number',
          description:
            'Count includes any promo tiles that may be positioned within each load. Variables of 12 are recommended',
        },
        {
          label: 'Load Previous Text',
          name: 'loadPreviousText',
          component: 'text',
        },
        {
          label: 'Load More Text',
          name: 'loadMoreText',
          component: 'text',
        },
      ],
      defaultValue: {
        resultsPerPage: 24,
        loadPreviousText: '↑ Load Previous',
        loadMoreText: 'Load More ↓',
        buttonStyle: 'btn-inverse-dark',
      },
    },
    {
      label: 'Product Item',
      name: 'productItem',
      component: 'group',
      description: 'Star rating, color variant selector, quick shop',
      fields: [
        {
          label: 'Enable Star Rating',
          name: 'enabledStarRating',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Enable Color Variant Selector',
          name: 'enabledColorSelector',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Enable Color Name On Hover',
          name: 'enabledColorNameOnHover',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Enable Quick Shop',
          name: 'enabledQuickShop',
          component: 'toggle',
          description:
            'Quick shop will only show if the product item has only one variant or multiple variants through a single option, e.g. "Size"',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Hide Quick Shop on Mobile',
          name: 'quickShopMobileHidden',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Quick Shop Text (Multi-variant)',
          name: 'quickShopMultiText',
          description: 'Use {{option}} to display the variant option name',
          component: 'text',
        },
        {
          label: 'Quick Shop Text (Single-variant)',
          name: 'quickShopSingleText',
          component: 'text',
        },
      ],
      defaultValue: {
        enabledStarRating: true,
        enabledColorSelector: true,
        enabledColorNameOnHover: false,
        enabledQuickShop: true,
        quickShopMobileHidden: true,
        quickShopMultiText: '+ Quick Add {{option}}',
        quickShopSingleText: '+ Quick Add',
      },
    },
    {
      label: 'Promotion',
      name: 'promotion',
      component: 'group',
      description: 'Promo tile campaigns',
      fields: [
        {
          label: 'Promo Tile Campaigns',
          name: 'campaigns',
          component: 'group-list',
          itemProps: {
            label: '{{item.name}}',
          },
          fields: [
            {
              label: 'Enable',
              name: 'enabled',
              component: 'toggle',
              toggleLabels: {
                true: 'On',
                false: 'Off',
              },
            },
            {
              label: 'Name',
              name: 'name',
              component: 'text',
            },
            {
              label: 'Promo Tiles',
              name: 'promoTiles',
              component: 'group-list',
              itemProps: {
                label: '{{item.position}}: {{item.text.heading}}',
              },
              fields: [
                {
                  label: 'Grid Position',
                  name: 'position',
                  component: 'number',
                  description: 'Assigns grid order',
                },
                {
                  label: 'Aspect Ratio',
                  name: 'aspectRatio',
                  component: 'select',
                  options: [
                    {label: '1:1', value: 'aspect-[1/1]'},
                    {label: '4:5', value: 'aspect-[4/5]'},
                    {label: '3:4', value: 'aspect-[3/4]'},
                    {label: '2:3', value: 'aspect-[2/3]'},
                    {label: '9:16', value: 'aspect-[9/16]'},
                    {label: 'Fill', value: 'h-full'},
                  ],
                },
                {
                  label: 'Link',
                  name: 'link',
                  component: 'link',
                  description: 'Makes the entire tile a clickable link',
                },
                {
                  label: 'Background Settings',
                  name: 'background',
                  component: 'group',
                  description: 'Background color, media, dark overlay',
                  fields: [
                    {
                      label: 'Background Color',
                      name: 'bgColor',
                      component: 'color',
                      colors: COLOR_PICKER_DEFAULTS,
                    },
                    {
                      label: 'Media Alt',
                      name: 'alt',
                      component: 'text',
                      description:
                        'Alt text set in media manager for selected media(s) will take priority. Re-add media(s) if alt text was set in media manager after selection.',
                    },
                    {
                      label: 'Media',
                      name: 'media',
                      component: 'image',
                      description: 'Overrides background color',
                    },
                    {
                      label: 'Video Poster Image',
                      name: 'videoPoster',
                      component: 'image',
                      description:
                        'Applicable if media is video. First frame of video while video loads when in view',
                    },
                    {
                      label: 'Dark Overlay',
                      name: 'darkOverlay',
                      component: 'toggle',
                      description: 'Adds 20% opacity black overlay over media',
                      toggleLabels: {
                        true: 'On',
                        false: 'Off',
                      },
                    },
                  ],
                },
                {
                  label: 'Text Settings',
                  name: 'text',
                  component: 'group',
                  description: 'Heading, subtext, text color',
                  fields: [
                    {
                      label: 'Heading',
                      name: 'heading',
                      component: 'text',
                    },
                    {
                      label: 'Subtext',
                      name: 'subtext',
                      component: 'textarea',
                    },
                    {
                      label: 'Text Color',
                      name: 'textColor',
                      component: 'color',
                      colors: COLOR_PICKER_DEFAULTS,
                    },
                  ],
                },
              ],
              defaultItem: {
                position: 5,
                aspectRatio: 'aspect-[3/4]',
                background: {
                  bgColor: COLOR_SCHEMA_DEFAULT_VALUE.neutralLightest,
                  darkOverlay: false,
                },
                text: {
                  heading: 'Promo Tile Heading',
                  subtext:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                  textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
                },
              },
            },
            {
              label: 'Collection Handles',
              name: 'collections',
              component: 'list',
              description:
                'Add all collection handles that will run this campaign, e.g. "all", "best-sellers".\n\nTo apply to search results page, add "search"',
              field: {
                component: 'text',
              },
            },
          ],
          defaultItem: {
            enabled: true,
            name: 'Campaign',
            promoTiles: [
              {
                position: 5,
                aspectRatio: 'aspect-[3/4]',
                background: {
                  bgColor: COLOR_SCHEMA_DEFAULT_VALUE.neutralLightest,
                  darkOverlay: false,
                },
                text: {
                  heading: 'Promo Tile Heading',
                  subtext:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                  textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
                },
              },
            ],
            collections: ['all'],
          },
        },
      ],
    },
    {
      label: 'Sort',
      name: 'sort',
      component: 'group',
      description: 'Enable, sort labels',
      fields: [
        {
          label: 'Enable',
          name: 'enabled',
          component: 'toggle',
          toggleLabels: {
            true: 'On',
            false: 'Off',
          },
        },
        {
          label: 'Default Label',
          name: 'defaultLabel',
          component: 'text',
        },
        {
          label: 'Best Selling Label',
          name: 'bestSellingLabel',
          component: 'text',
        },
        {
          label: 'Price High to Low Label',
          name: 'highToLowLabel',
          component: 'text',
        },
        {
          label: 'Price Low to High Label',
          name: 'lowToHighLabel',
          component: 'text',
        },
        {
          label: 'A to Z Label',
          name: 'aToZLabel',
          component: 'text',
        },
        {
          label: 'Z to A Label',
          name: 'zToALabel',
          component: 'text',
        },
        {
          label: 'Newest Label',
          name: 'newestLabel',
          component: 'text',
        },
        {
          label: 'Oldest Label',
          name: 'oldestLabel',
          component: 'text',
        },
      ],
      defaultValue: {
        enabled: true,
        defaultLabel: 'Featured',
        bestSellingLabel: 'Best Selling',
        highToLowLabel: 'High to Low',
        lowToHighLabel: 'Low to High',
        aToZLabel: 'A - Z',
        zToALabel: 'Z - A',
        newestLabel: 'Newest',
        oldestLabel: 'Oldest',
      },
    },
  ],
};
