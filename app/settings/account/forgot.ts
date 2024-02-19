export interface ForgotSettings {
  heading: string;
  subtext: string;
  postSubmissionText: string;
}

export default {
  label: 'Forgot Password',
  name: 'forgot',
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
      label: 'Post Submission Text',
      name: 'postSubmissionText',
      component: 'text',
    },
  ],
  defaultValue: {
    heading: 'Forgot Password',
    subtext: 'We will send you an email to reset your password.',
    postSubmissionText: 'If account exists, an email will be sent shortly',
  },
};
