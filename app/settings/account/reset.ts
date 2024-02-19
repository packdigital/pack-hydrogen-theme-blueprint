export interface ResetSettings {
  heading: string;
  subtext: string;
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
  ],
  defaultValue: {
    heading: 'Reset Password',
    subtext: 'Please enter your new password.',
  },
};
