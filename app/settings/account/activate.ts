export interface ActivateSettings {
  heading: string;
  subtext: string;
  submitText: string;
}

export default {
  label: 'Activate Account',
  name: 'activate',
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
      component: 'text',
    },
    {
      label: 'Submit Text',
      name: 'submitText',
      component: 'text',
    },
  ],
  defaultValue: {
    heading: 'Activate Account',
    subtext: 'Create your password to activate your account.',
    submitText: 'Activate Account',
  },
};
