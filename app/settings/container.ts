import {COLORS} from './common';

export interface ContainerSettings {
  bgColor?: string;
  bgColorCustom?: string;
  tabletDesktopPaddingTop?: string;
  tabletDesktopPaddingBottom?: string;
  tabletDesktopMarginBottom?: string;
  mobilePaddingTop?: string;
  mobilePaddingBottom?: string;
  mobileMarginBottom?: string;
}

export const containerSettings = (defaults?: ContainerSettings) => ({
  label: 'Container Settings',
  name: 'container',
  component: 'group',
  description: 'Background color, padding, bottom margin',
  fields: [
    {
      label: 'Background Color (Theme)',
      name: 'bgColor',
      component: 'select',
      options: COLORS,
      defaultValue: defaults?.bgColor || 'var(--background)',
    },
    {
      label: 'Background Color (Custom)',
      name: 'bgColorCustom',
      component: 'color',
      description: 'Overrides the selected theme color',
    },
    {
      label: 'Top Padding (tablet/desktop)',
      name: 'tabletDesktopPaddingTop',
      component: 'select',
      description: 'Adds additional top padding to tablet/desktop',
      options: [
        {label: '0px', value: 'md:pt-0'},
        {label: '8px', value: 'md:pt-2'},
        {label: '16px', value: 'md:pt-4'},
        {label: '24px', value: 'md:pt-6'},
        {label: '32px', value: 'md:pt-8'},
        {label: '40px', value: 'md:pt-10'},
        {label: '48px', value: 'md:pt-12'},
      ],
      defaultValue: defaults?.tabletDesktopPaddingTop || 'md:pt-0',
    },
    {
      label: 'Bottom Padding (tablet/desktop)',
      name: 'tabletDesktopPaddingBottom',
      component: 'select',
      description: 'Adds additional bottom padding on tablet/desktop',
      options: [
        {label: '0px', value: 'md:pb-0'},
        {label: '8px', value: 'md:pb-2'},
        {label: '16px', value: 'md:pb-4'},
        {label: '24px', value: 'md:pb-6'},
        {label: '32px', value: 'md:pb-8'},
        {label: '40px', value: 'md:pb-10'},
        {label: '48px', value: 'md:pb-12'},
      ],
      defaultValue: defaults?.tabletDesktopPaddingBottom || 'md:pb-0',
    },
    {
      label: 'Bottom Margin (tablet/desktop)',
      name: 'tabletDesktopMarginBottom',
      component: 'select',
      description: 'Adds a bottom margin on tablet/desktop',
      options: [
        {label: '0px', value: 'md:mb-0'},
        {label: '8px', value: 'md:mb-2'},
        {label: '16px', value: 'md:mb-4'},
        {label: '24px', value: 'md:mb-6'},
        {label: '32px', value: 'md:mb-8'},
        {label: '40px', value: 'md:mb-10'},
        {label: '48px', value: 'md:mb-12'},
      ],
      defaultValue: defaults?.tabletDesktopMarginBottom || 'md:mb-0',
    },
    {
      label: 'Top Padding (mobile)',
      name: 'mobilePaddingTop',
      component: 'select',
      description: 'Adds additional top padding on mobile',
      options: [
        {label: '0px', value: 'pt-0'},
        {label: '8px', value: 'pt-2'},
        {label: '16px', value: 'pt-4'},
        {label: '24px', value: 'pt-6'},
        {label: '32px', value: 'pt-8'},
        {label: '40px', value: 'pt-10'},
        {label: '48px', value: 'pt-12'},
      ],
      defaultValue: defaults?.mobilePaddingTop || 'pt-0',
    },
    {
      label: 'Bottom Padding (mobile)',
      name: 'mobilePaddingBottom',
      component: 'select',
      description: 'Adds additional bottom padding on mobile',
      options: [
        {label: '0px', value: 'pb-0'},
        {label: '8px', value: 'pb-2'},
        {label: '16px', value: 'pb-4'},
        {label: '24px', value: 'pb-6'},
        {label: '32px', value: 'pb-8'},
        {label: '40px', value: 'pb-10'},
        {label: '48px', value: 'pb-12'},
      ],
      defaultValue: defaults?.mobilePaddingBottom || 'pb-0',
    },
    {
      label: 'Bottom Margin (mobile)',
      name: 'mobileMarginBottom',
      component: 'select',
      description: 'Adds a bottom margin on mobile',
      options: [
        {label: '0px', value: 'mb-0'},
        {label: '8px', value: 'mb-2'},
        {label: '16px', value: 'mb-4'},
        {label: '24px', value: 'mb-6'},
        {label: '32px', value: 'mb-8'},
        {label: '40px', value: 'mb-10'},
        {label: '48px', value: 'mb-12'},
      ],
      defaultValue: defaults?.mobileMarginBottom || 'mb-0',
    },
  ],
});
