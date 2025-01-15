/* Common default values for color schema field */
export const COLOR_SCHEMA_DEFAULT_VALUE = {
  white: '#ffffff',
  neutralLightest: '#f9f9f9',
  neutralLighter: '#d4d4d4',
  neutralLight: '#a3a3a3',
  neutralMedium: '#737373',
  neutralDark: '#525252',
  neutralDarker: '#404040',
  neutralDarkest: '#171717',
  black: '#000000',
  background: '#FFFFFF',
  border: '#e8e8e8',
  text: '#000000',
  primary: '#008464',
  secondary: '#8164bf',
  /* Add additional common default schema values here */
};

/* Array of theme color hex codes for the color picker */
export const COLOR_PICKER_DEFAULTS = [
  '#008464',
  '#8164bf',
  '#189cc5',
  '#4a69d4',
  '#ffffff',
  '#f9f9f9',
  '#e8e8e8',
  '#d4d4d4',
  '#a3a3a3',
  '#737373',
  '#525252',
  '#404040',
  '#171717',
  '#000000',
];

/*
 * Update button styles and class names as per project's theme
 */

export const BUTTONS = [
  {label: 'Primary', value: 'btn-primary'},
  {label: 'Secondary', value: 'btn-secondary'},
  {label: 'Inverse Light', value: 'btn-inverse-light'},
  {label: 'Inverse Dark', value: 'btn-inverse-dark'},
];

export const FLEX_POSITIONS = {
  mobile: [
    {
      value: 'justify-start items-start',
      label: 'Left Top',
    },
    {
      value: 'justify-start items-center',
      label: 'Left Center',
    },
    {
      value: 'justify-start items-end',
      label: 'Left Bottom',
    },
    {
      value: 'justify-center items-start',
      label: 'Center Top',
    },
    {
      value: 'justify-center items-center',
      label: 'Center Center',
    },
    {
      value: 'justify-center items-end',
      label: 'Center Bottom',
    },
    {
      value: 'justify-end items-start',
      label: 'Right Top',
    },
    {
      value: 'justify-end items-center',
      label: 'Right Center',
    },
    {
      value: 'justify-end items-end',
      label: 'Right Bottom',
    },
  ],
  desktop: [
    {
      value: 'md:justify-start md:items-start',
      label: 'Left Top',
    },
    {
      value: 'md:justify-start md:items-center',
      label: 'Left Center',
    },
    {
      value: 'md:justify-start md:items-end',
      label: 'Left Bottom',
    },
    {
      value: 'md:justify-center md:items-start',
      label: 'Center Top',
    },
    {
      value: 'md:justify-center md:items-center',
      label: 'Center Center',
    },
    {
      value: 'md:justify-center md:items-end',
      label: 'Center Bottom',
    },
    {
      value: 'md:justify-end md:items-start',
      label: 'Right Top',
    },
    {
      value: 'md:justify-end md:items-center',
      label: 'Right Center',
    },
    {
      value: 'md:justify-end md:items-end',
      label: 'Right Bottom',
    },
  ],
};

export const OBJECT_POSITIONS = {
  mobile: [
    {
      value: 'object-left-top',
      label: 'Left Top',
    },
    {
      value: 'object-left',
      label: 'Left Center',
    },
    {
      value: 'object-left-bottom',
      label: 'Left Bottom',
    },
    {
      value: 'object-top',
      label: 'Center Top',
    },
    {
      value: 'object-center',
      label: 'Center Center',
    },
    {
      value: 'object-bottom',
      label: 'Center Bottom',
    },
    {
      value: 'object-right-top',
      label: 'Right Top',
    },
    {
      value: 'object-right',
      label: 'Right Center',
    },
    {
      value: 'object-right-bottom',
      label: 'Right Bottom',
    },
  ],
  desktop: [
    {
      value: 'md:object-left-top',
      label: 'Left Top',
    },
    {
      value: 'md:object-left',
      label: 'Left Center',
    },
    {
      value: 'md:object-left-bottom',
      label: 'Left Bottom',
    },
    {
      value: 'md:object-top',
      label: 'Center Top',
    },
    {
      value: 'md:object-center',
      label: 'Center Center',
    },
    {
      value: 'md:object-bottom',
      label: 'Center Bottom',
    },
    {
      value: 'md:object-right-top',
      label: 'Right Top',
    },
    {
      value: 'md:object-right',
      label: 'Right Center',
    },
    {
      value: 'md:object-right-bottom',
      label: 'Right Bottom',
    },
  ],
};

export const CROP_POSITIONS = [
  {value: 'center', label: 'Center'},
  {value: 'top', label: 'Top'},
  {value: 'bottom', label: 'Bottom'},
  {value: 'left', label: 'Left'},
  {value: 'right', label: 'Right'},
];

export const TEXT_ALIGN = {
  mobile: [
    {label: 'Left', value: 'text-left'},
    {label: 'Center', value: 'text-center'},
    {label: 'Right', value: 'text-right'},
  ],
  desktop: [
    {label: 'Left', value: 'md:text-left'},
    {label: 'Center', value: 'md:text-center'},
    {label: 'Right', value: 'md:text-right'},
  ],
};

export const CONTENT_ALIGN = {
  mobile: [
    {label: 'Left', value: 'text-left items-start'},
    {label: 'Center', value: 'text-center items-center'},
    {label: 'Right', value: 'text-right items-end'},
  ],
  desktop: [
    {label: 'Left', value: 'md:text-left md:items-start'},
    {label: 'Center', value: 'md:text-center md:items-center'},
    {label: 'Right', value: 'md:text-right md:items-end'},
  ],
};

export const HEADING_SIZES = [
  {label: 'H1', value: 'text-h1'},
  {label: 'H2', value: 'text-h2'},
  {label: 'H3', value: 'text-h3'},
  {label: 'H4', value: 'text-h4'},
  {label: 'H5', value: 'text-h5'},
  {label: 'H6', value: 'text-h6'},
];
