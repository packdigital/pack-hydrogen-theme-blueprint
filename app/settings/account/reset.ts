export interface ResetSettings {
  heading: string;
  subtext: string;
  submitText: string;
}

export default {
  label: 'Password Reset',
  name: 'reset',
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
    heading: 'Reset Password',
    subtext: 'Please enter your new password.',
    submitText: 'Reset Password',
  },
};
