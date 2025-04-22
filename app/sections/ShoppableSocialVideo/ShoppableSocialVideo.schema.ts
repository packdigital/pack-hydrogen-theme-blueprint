import {BUTTONS, COLOR_PICKER_DEFAULTS} from '~/settings/common';

export const productSettingsDefaults = {
  enabledStarRating: true,
  enabledQuantitySelector: true,
  optionsBtnText: 'Choose Options',
  optionsBtnStyle: 'btn-secondary',
  atcBtnText: 'Add To Cart',
  atcBtnStyle: 'btn-primary',
  viewText: 'View Product',
  badgeBgColor: '#FFFFFF',
  badgeTextColor: '#000000',
};

export const sliderSettingsDefaults = {
  enabledScrollbar: true,
  scrollbarColor: '#FFFFFF',
  slideBgColor: '#FFFFFF',
  slideBgOpacity: 0.7,
  slideBgBlur: 6,
  slideTextColor: '#000000',
};

export const textSettingsDefaults = {
  heading: 'Shop Our Products',
  subtext: '',
  enabledScrollForMore: true,
  scrollText: 'Scroll for more',
  color: '#FFFFFF',
};

export const backgroundSettingsDefaults = {
  colorType: 'to bottom',
  firstColor: '#94A3B8',
  secondColor: '#E2E8F0',
  thirdColor: '',
};

export const SHOPPABLE_SOCIAL_VIDEO_SECTION_KEY = 'shoppable-social-video';

export function Schema({template}: {template: string}) {
  if (template !== 'page') return null;

  return {
    category: 'Product',
    label: 'Shoppable Social Video',
    key: SHOPPABLE_SOCIAL_VIDEO_SECTION_KEY,
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0822/0439/3780/files/shoppable-social-video-preview_323400b2-b1ef-43d2-af9c-fadaf4bbd2a3.jpg?v=1723144391',
    fields: [
      {
        label: 'Products',
        name: 'products',
        component: 'group-list',
        description:
          'If the selected product does display in the frontend, check it is on the Hydrogen sales channel.',
        itemProps: {
          label: '{{item.product.handle}}',
        },
        fields: [
          {
            name: 'product',
            component: 'productSearch',
            label: 'Product',
          },
          {
            label: 'Image',
            name: 'image',
            component: 'image',
            description: 'Overrides product featured image',
          },
          {
            label: 'Badge Text',
            name: 'badge',
            component: 'text',
          },
          {
            label: 'Short Description',
            name: 'description',
            component: 'textarea',
            description: 'Visible when the product card is expanded',
          },
        ],
      },
      {
        label: 'Video Settings',
        name: 'video',
        description: 'Video, poster image',
        component: 'group',
        fields: [
          {
            label: 'Video',
            name: 'video',
            component: 'image',
          },
          {
            label: 'Poster Image',
            name: 'poster',
            component: 'image',
            description: 'First frame of video while video loads',
          },
        ],
      },
      {
        label: 'Product Settings',
        name: 'product',
        component: 'group',
        description:
          'Star rating, quantity selector, button texts and colors, badge color',
        fields: [
          {
            label: 'Enable Star Rating',
            name: 'enabledStarRating',
            component: 'toggle',
            description:
              'For the actual star rating, API logic must be first implemented in the ProductStars component. Otherwise the manual rating set in site settings will be displayed',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Enable Quantity Selector',
            name: 'enabledQuantitySelector',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Choose Options Button Text',
            name: 'optionsBtnText',
            component: 'text',
            description: 'Applicable only if product has options',
          },
          {
            label: 'Choose Options Button Style',
            name: 'optionsBtnStyle',
            component: 'select',
            options: BUTTONS,
          },
          {
            label: 'Add To Cart Button Text',
            name: 'atcBtnText',
            component: 'text',
          },
          {
            label: 'Add To Cart Button Style',
            name: 'atcBtnStyle',
            component: 'select',
            options: BUTTONS,
          },
          {
            label: 'View Product Text',
            name: 'viewText',
            component: 'text',
          },
          {
            label: 'Badge Background Color',
            name: 'badgeBgColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
          {
            label: 'Badge Text Color',
            name: 'badgeTextColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
        ],
        defaultValue: productSettingsDefaults,
      },
      {
        label: 'Slider Settings',
        name: 'slider',
        component: 'group',
        description:
          'Scrollbar, slide background color, slide opacity, slide text color',
        fields: [
          {
            label: 'Enable Scrollbar',
            name: 'enabledScrollbar',
            component: 'toggle',
            description: 'Applicable only if more than one product',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Scrollbar Color',
            name: 'scrollbarColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
          {
            label: 'Slide Background Color',
            name: 'slideBgColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
          {
            label: 'Slide Background Opacity',
            name: 'slideBgOpacity',
            component: 'number',
            description: '0 to 1.0',
          },
          {
            label: 'Slide Background Blur (px)',
            name: 'slideBgBlur',
            component: 'number',
          },
          {
            label: 'Slide Text Color',
            name: 'slideTextColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
        ],
        defaultValue: sliderSettingsDefaults,
      },
      {
        label: 'Text Settings',
        name: 'text',
        description: 'Heading, subtext, scroll for more text, text color',
        component: 'group',
        fields: [
          {
            label: 'Heading',
            name: 'heading',
            component: 'text',
          },
          {
            label: 'Subtext',
            name: 'subtext',
            component: 'rich-text',
            description: 'Subtext below the product slider',
          },
          {
            label: 'Show Scroll For More',
            name: 'enabledScrollForMore',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Scroll For More Text',
            name: 'scrollText',
            component: 'text',
          },
          {
            label: 'Text and Icon Color',
            name: 'color',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
            description: 'Color of any text and icons overlaying the video',
          },
        ],
        defaultValue: textSettingsDefaults,
      },
      {
        label: 'Background Settings',
        name: 'background',
        description: 'Background color behind the video',
        component: 'group',
        fields: [
          {
            label: 'Color Type',
            name: 'colorType',
            component: 'select',
            description: 'Solid color will use the first color',
            options: [
              {label: 'Solid', value: 'solid'},
              {label: 'Gradient (top to bottom)', value: 'to bottom'},
              {
                label: 'Gradient (top left to bottom right)',
                value: 'to bottom right',
              },
              {label: 'Gradient (left to right)', value: 'to right'},
              {
                label: 'Gradient (bottom left to top right)',
                value: 'to top right',
              },
            ],
          },
          {
            label: 'First Color',
            name: 'firstColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
          {
            label: 'Second Color (optional)',
            name: 'secondColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
          {
            label: 'Third Color (optional)',
            name: 'thirdColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
        ],
        defaultValue: backgroundSettingsDefaults,
      },
    ],
  };
}
