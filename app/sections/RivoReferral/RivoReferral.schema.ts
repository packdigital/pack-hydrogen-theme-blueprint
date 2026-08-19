import {
  BUTTONS,
  COLOR_PICKER_DEFAULTS,
  COLOR_SCHEMA_DEFAULT_VALUE,
} from '~/settings/common';
import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Loyalty',
    label: 'Rivo Referral',
    key: 'rivo-referral',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Refer a friend',
      },
      {
        label: 'Subtext',
        name: 'subtext',
        component: 'text',
        defaultValue: 'Share your link and you both get rewarded.',
      },
      {
        label: 'Labels',
        name: 'labels',
        component: 'group',
        description: 'Copy button, empty state, signed-out message',
        fields: [
          {
            label: 'Copy Button Text',
            name: 'copyText',
            component: 'text',
            defaultValue: 'Copy link',
          },
          {
            label: 'Copied Text',
            name: 'copiedText',
            component: 'text',
            defaultValue: 'Copied!',
          },
          {
            label: 'Empty Message',
            name: 'emptyMessage',
            component: 'text',
            defaultValue: 'Your referral link is not available yet.',
          },
          {
            label: 'Signed Out Message',
            name: 'signedOutMessage',
            component: 'text',
            defaultValue: 'Sign in to get your referral link.',
          },
          {
            label: 'Sign In Button Text',
            name: 'signInText',
            component: 'text',
            defaultValue: 'Sign in',
          },
        ],
        defaultValue: {
          copyText: 'Copy link',
          copiedText: 'Copied!',
          emptyMessage: 'Your referral link is not available yet.',
          signedOutMessage: 'Sign in to get your referral link.',
          signInText: 'Sign in',
        },
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description:
          'Above the fold, referral list, button style, text color, full width',
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
            label: 'Show Referral List',
            name: 'showReferralList',
            component: 'toggle',
            description: "Lists the customer's individual referrals and status",
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
          showReferralList: false,
          buttonStyle: 'btn-primary',
          textColor: COLOR_SCHEMA_DEFAULT_VALUE.text,
          fullWidth: false,
        },
      },
      containerSettings(),
    ],
  };
}
