/*
 * Update button styles and class names as per project's theme
 */

export const BUTTONS = [
  {label: 'Primary', value: 'btn-primary'},
  {label: 'Secondary', value: 'btn-secondary'},
  {label: 'Inverse Light', value: 'btn-inverse-light'},
  {label: 'Inverse Dark', value: 'btn-inverse-dark'},
];

/*
 * Update color labels and values as per project's theme
 * IMPORTANT: Do not string interpolate values; Tailwind requires absolute values
 */

export const COLORS = [
  {label: 'Background', value: 'var(--background)'},
  {label: 'Text', value: 'var(--text)'},
  {label: 'Border', value: 'var(--border)'},
  {label: 'Primary', value: 'var(--primary)'},
  {label: 'Secondary', value: 'var(--secondary)'},
  {label: 'Accent 1', value: 'var(--accent1)'},
  {label: 'Accent 2', value: 'var(--accent2)'},
  {label: 'Black', value: 'var(--black)'},
  {label: 'Off Black', value: 'var(--off-black)'},
  {label: 'Dark Gray', value: 'var(--dark-gray)'},
  {label: 'Medium Dark Gray', value: 'var(--medium-dark-gray)'},
  {label: 'Medium Gray', value: 'var(--medium-gray)'},
  {label: 'Gray', value: 'var(--gray)'},
  {label: 'Light Gray', value: 'var(--light-gray)'},
  {label: 'Off White', value: 'var(--off-white)'},
  {label: 'White', value: 'var(--white)'},
  {label: 'Transparent', value: 'transparent'},
];

export const TEXT_COLORS = {
  mobile: [
    {label: 'Background', value: 'text-[var(--background)]'},
    {label: 'Text', value: 'text-[var(--text)]'},
    {label: 'Border', value: 'text-[var(--border)]'},
    {label: 'Primary', value: 'text-[var(--primary)]'},
    {label: 'Secondary', value: 'text-[var(--secondary)]'},
    {label: 'Accent 1', value: 'text-[var(--accent1)]'},
    {label: 'Accent 2', value: 'text-[var(--accent2)]'},
    {label: 'Black', value: 'text-[var(--black)]'},
    {label: 'Off Black', value: 'text-[var(--off-black)]'},
    {label: 'Dark Gray', value: 'text-[var(--dark-gray)]'},
    {label: 'Medium Dark Gray', value: 'text-[var(--medium-dark-gray)]'},
    {label: 'Medium Gray', value: 'text-[var(--medium-gray)]'},
    {label: 'Gray', value: 'text-[var(--gray)]'},
    {label: 'Light Gray', value: 'text-[var(--light-gray)]'},
    {label: 'Off White', value: 'text-[var(--off-white)]'},
    {label: 'White', value: 'text-[var(--white)]'},
    {label: 'Transparent', value: 'text-transparent'},
  ],
  desktop: [
    {label: 'Background', value: 'md:text-[var(--background)]'},
    {label: 'Text', value: 'md:text-[var(--text)]'},
    {label: 'Border', value: 'md:text-[var(--border)]'},
    {label: 'Primary', value: 'md:text-[var(--primary)]'},
    {label: 'Secondary', value: 'md:text-[var(--secondary)]'},
    {label: 'Accent 1', value: 'md:text-[var(--accent1)]'},
    {label: 'Accent 2', value: 'md:text-[var(--accent2)]'},
    {label: 'Black', value: 'md:text-[var(--black)]'},
    {label: 'Off Black', value: 'md:text-[var(--off-black)]'},
    {label: 'Dark Gray', value: 'md:text-[var(--dark-gray)]'},
    {label: 'Medium Dark Gray', value: 'md:text-[var(--medium-dark-gray)]'},
    {label: 'Medium Gray', value: 'md:text-[var(--medium-gray)]'},
    {label: 'Gray', value: 'md:text-[var(--gray)]'},
    {label: 'Light Gray', value: 'md:text-[var(--light-gray)]'},
    {label: 'Off White', value: 'md:text-[var(--off-white)]'},
    {label: 'White', value: 'md:text-[var(--white)]'},
    {label: 'Transparent', value: 'md:text-transparent'},
  ],
};

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
