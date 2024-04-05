import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Marketing',
    label: 'Marketing Signup',
    key: 'marketing-signup',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/marketing-signup-preview.jpg?v=1712011640',
    fields: [
      {
        label: 'Type',
        name: 'type',
        component: 'radio-group',
        direction: 'horizontal',
        variant: 'radio',
        options: [
          {label: 'Email', value: 'email'},
          {label: 'Phone', value: 'phone'},
          {label: 'Email & Phone', value: 'emailPhone'},
        ],
        defaultValue: 'email',
      },
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Stay In Touch',
      },
      {
        label: 'Email Signup Settings',
        name: 'email',
        component: 'group',
        description:
          'List ID, heading, subtext, placeholder, button text, thank you text',
        fields: [
          {
            label: 'List ID',
            name: 'listId',
            component: 'text',
            description:
              'Submit button will be disabled until entered, e.g. "S6Qqx9"',
          },
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
            label: 'Placholder Text',
            name: 'placeholder',
            component: 'text',
          },
          {
            label: 'Button Text',
            name: 'buttonText',
            component: 'text',
          },
          {
            label: 'Thank You Text',
            name: 'thankYouText',
            component: 'text',
          },
        ],
        defaultValue: {
          heading: 'Email Newsletter',
          subtext:
            'Get the latest news and updates sent straight to your inbox.',
          placeholder: 'Enter your email...',
          buttonText: 'Sign Up',
          thankYouText: 'Thank you for signing up!',
        },
      },
      {
        label: 'Phone Signup Settings',
        name: 'phone',
        component: 'group',
        description:
          'List ID, heading, subtext, placeholder, button text, thank you text, SMS consent text',
        fields: [
          {
            label: 'List ID',
            name: 'listId',
            component: 'text',
            description:
              'Submit button will be disabled until entered, e.g. "S6Qqx9"',
          },
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
            label: 'Placholder Text',
            name: 'placeholder',
            component: 'text',
          },
          {
            label: 'Button Text',
            name: 'buttonText',
            component: 'text',
          },
          {
            label: 'Thank You Text',
            name: 'thankYouText',
            component: 'text',
          },
          {
            label: 'SMS Consent Text',
            name: 'smsConsentText',
            component: 'textarea',
          },
          {
            label: 'SMS Consent Inline Links',
            name: 'smsConsentLinks',
            component: 'group-list',
            itemProps: {
              label: '{{item.link.text}}',
            },
            defaultItem: {link: {text: 'View Privacy Policy', url: ''}},
            fields: [
              {
                label: 'Link',
                name: 'link',
                component: 'link',
              },
            ],
          },
        ],
        defaultValue: {
          heading: 'SMS Updates',
          subtext:
            'Get the latest news and updates sent straight to your phone.',
          placeholder: 'Enter your phone number...',
          buttonText: 'Sign Up',
          thankYouText: 'Thank you for signing up!',
          smsConsentText:
            'By checking this box, you agree to receive recurring promotional marketing text messages from us at the cell number provided.',
        },
      },
      containerSettings(),
    ],
  };
}
