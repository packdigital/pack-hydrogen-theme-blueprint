import {
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Loyalty',
    label: 'Rivo Loyalty Status',
    key: 'rivo-loyalty-status',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Your rewards',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'text',
        defaultValue: 'Earn points on every order and redeem them for rewards.',
      },
      {
        label: 'Labels',
        name: 'labels',
        component: 'group',
        description: 'Tile labels, VIP heading, signed-out message',
        fields: [
          {
            label: 'Points Label',
            name: 'pointsLabel',
            component: 'text',
            defaultValue: 'Points balance',
          },
          {
            label: 'Store Credit Label',
            name: 'creditsLabel',
            component: 'text',
            defaultValue: 'Store credit',
          },
          {
            label: 'Lifetime Points Label',
            name: 'lifetimeLabel',
            component: 'text',
            defaultValue: 'Lifetime points',
          },
          {
            label: 'VIP Tiers Heading',
            name: 'tiersHeading',
            component: 'text',
            defaultValue: 'VIP tiers',
          },
          {
            label: 'Signed Out Message',
            name: 'signedOutMessage',
            component: 'text',
            defaultValue: 'Sign in to see your points and rewards.',
          },
          {
            label: 'Sign In Button Text',
            name: 'signInText',
            component: 'text',
            defaultValue: 'Sign in',
          },
        ],
        defaultValue: {
          pointsLabel: 'Points balance',
          creditsLabel: 'Store credit',
          lifetimeLabel: 'Lifetime points',
          tiersHeading: 'VIP tiers',
          signedOutMessage: 'Sign in to see your points and rewards.',
          signInText: 'Sign in',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description:
          'Above the fold, tiles shown, VIP tiers, text color, full width',
        fields: [
          {
            label: 'Above The Fold',
            name: 'aboveTheFold',
            component: 'toggle',
            description: 'Sets the heading as H1',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Show Store Credit',
            name: 'showCredits',
            component: 'toggle',
            description: 'Requires store credit to be enabled in Rivo',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Show Lifetime Points',
            name: 'showLifetimePoints',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Show VIP Tiers',
            name: 'showVipTiers',
            component: 'toggle',
            description: 'Requires VIP tiers to be configured in Rivo',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Text Color',
            name: 'textColor',
            component: 'color',
            colors: COLOR_PICKER_DEFAULTS,
          },
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
        ],
        defaultValue: {
          aboveTheFold: false,
          showCredits: true,
          showLifetimePoints: false,
          showVipTiers: true,
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
