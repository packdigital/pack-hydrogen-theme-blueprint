export interface ProfileSettings {
  enableMarketingOptIn: boolean;
  marketingOptInText: string;
}

export default {
  label: 'Profile',
  name: 'profile',
  component: 'group',
  description: 'Edit profile form, marketing opt-in',
  fields: [
    {
      label: 'Enable Marketing Opt-In',
      name: 'enableMarketingOptIn',
      component: 'toggle',
      description:
        'Show a marketing email opt-in checkbox on the edit profile form',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
      defaultValue: true,
    },
    {
      label: 'Marketing Opt-In Text',
      name: 'marketingOptInText',
      component: 'textarea',
      description: 'Text shown next to the marketing opt-in checkbox',
    },
  ],
  defaultValue: {
    enableMarketingOptIn: true,
    marketingOptInText: 'Email me with news and offers',
  },
};
