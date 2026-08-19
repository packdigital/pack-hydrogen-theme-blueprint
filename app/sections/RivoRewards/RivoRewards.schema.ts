import {
  BUTTONS,
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Loyalty',
    label: 'Rivo Rewards',
    key: 'rivo-rewards',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Redeem your points',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'text',
        defaultValue:
          'Redeeming applies a discount code to your cart automatically.',
      },
      {
        label: 'Labels',
        name: 'labels',
        component: 'group',
        description: 'Redeem button, empty state, signed-out message',
        fields: [
          {
            label: 'Redeem Button Text',
            name: 'redeemText',
            component: 'text',
            defaultValue: 'Redeem',
          },
          {
            label: 'Empty Message',
            name: 'emptyMessage',
            component: 'text',
            defaultValue:
              'No rewards are available right now. Check back soon.',
          },
          {
            label: 'Signed Out Message',
            name: 'signedOutMessage',
            component: 'text',
            defaultValue: 'Sign in to redeem your points for rewards.',
          },
          {
            label: 'Sign In Button Text',
            name: 'signInText',
            component: 'text',
            defaultValue: 'Sign in',
          },
          {
            label: 'Unused Rewards Heading',
            name: 'unusedHeading',
            component: 'text',
            defaultValue: 'Your unused rewards',
          },
          {
            label: 'Unused Rewards Subtext',
            name: 'unusedSubtext',
            component: 'text',
            defaultValue:
              'You’ve already redeemed these. Apply one to your cart, or enter the code at checkout.',
          },
        ],
        defaultValue: {
          redeemText: 'Redeem',
          unusedHeading: 'Your unused rewards',
          unusedSubtext:
            'You’ve already redeemed these. Apply one to your cart, or enter the code at checkout.',
          emptyMessage: 'No rewards are available right now. Check back soon.',
          signedOutMessage: 'Sign in to redeem your points for rewards.',
          signInText: 'Sign in',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description:
          'Above the fold, grid columns, balance, open cart on redeem, button style, text color, full width',
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
            label: 'Grid Columns',
            name: 'gridColumns',
            component: 'select',
            options: [
              {label: '2', value: '2'},
              {label: '3', value: '3'},
              {label: '4', value: '4'},
            ],
          },
          {
            label: 'Show Points Balance',
            name: 'showBalance',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Show Unused Rewards',
            name: 'showUnusedRewards',
            component: 'toggle',
            description:
              'Lists codes the customer already spent points on but has not used, so a failed apply is recoverable. Strongly recommended.',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Open Cart On Redeem',
            name: 'openCartOnRedeem',
            component: 'toggle',
            description:
              'Opens the cart drawer after a reward is applied. Gift card and store credit rewards never open the cart.',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Button Style',
            name: 'buttonStyle',
            component: 'select',
            options: BUTTONS,
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
          gridColumns: '3',
          showBalance: true,
          showUnusedRewards: true,
          openCartOnRedeem: true,
          buttonStyle: 'btn-primary',
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
