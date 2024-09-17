export interface LoginSettings {
  pageHeading: string;
  heading: string;
  forgotText: string;
  submitText: string;
  createText: string;
  createLinkText: string;
  unidentifiedCustomerText: string;
}

export default {
  label: 'Login',
  name: 'login',
  component: 'group',
  fields: [
    {
      label: 'Page Heading',
      name: 'pageHeading',
      component: 'text',
    },
    {
      label: 'Login Heading',
      name: 'heading',
      component: 'text',
    },
    {
      label: 'Forgot Password Text',
      name: 'forgotText',
      component: 'text',
    },
    {
      label: 'Submit Text',
      name: 'submitText',
      component: 'text',
    },
    {
      label: 'Create Account Text (mobile)',
      name: 'createText',
      component: 'text',
    },
    {
      label: 'Create Account Link Text (mobile)',
      name: 'createLinkText',
      component: 'text',
    },
    {
      label: 'Unidentified Customer Error Text',
      name: 'unidentifiedCustomerText',
      component: 'text',
    },
  ],
  defaultValue: {
    pageHeading: 'Welcome!',
    heading: 'Sign In',
    forgotText: 'Forgot Password',
    submitText: 'Log In',
    createText: `Don't have an account?`,
    createLinkText: 'Create Account',
    unidentifiedCustomerText: 'The email and password do not match',
  },
};
