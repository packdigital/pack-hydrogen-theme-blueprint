import snakeCase from 'lodash/snakeCase';

import {containerSettings} from '~/settings/container';

const inputField = (type) => ({
  label: type,
  key: snakeCase(type),
  defaultItem: {
    name: snakeCase(type),
    label: `${type}`,
  },
  itemProps: {
    label: `${type}: {{item.label}}`,
  },
  fields: [
    {
      label: 'Name',
      name: 'name',
      component: 'text',
      validate: {
        required: true,
      },
      description:
        'Unique, lowercase, and no spaces\ne.g. "email", "first_name", "accepts_marketing"',
    },
    {
      label: 'Label',
      name: 'label',
      component: 'text',
    },
    {
      label: 'Placeholder',
      name: 'placeholder',
      component: 'text',
    },
    {
      label: 'Info Message',
      name: 'infoMessage',
      component: 'text',
    },
    {
      label: 'Required',
      name: 'required',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Half Width',
      name: 'halfWidth',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
  ],
});

const multiChoiceField = (type) => ({
  label: type,
  key: snakeCase(type),
  defaultItem: {
    name: snakeCase(type),
    label: `${type}`,
  },
  itemProps: {
    label: `${type}: {{item.label}}`,
  },
  fields: [
    {
      label: 'Name',
      name: 'name',
      component: 'text',
      validate: {
        required: true,
      },
      description:
        'Unique, lowercase, and no spaces\ne.g. "email", "first_name", "accepts_marketing"',
    },
    {
      label: 'Label',
      name: 'label',
      component: 'text',
    },
    ...(type === 'Select'
      ? [
          {
            label: 'Placeholder',
            name: 'placeholder',
            component: 'text',
          },
        ]
      : []),
    {
      label: 'Info Message',
      name: 'infoMessage',
      component: 'text',
    },
    {
      label: 'Options',
      name: 'options',
      component: 'list',
      field: {component: 'text'},
    },
    ...(type === 'Radio' || type === 'Multiple Checkbox'
      ? [
          {
            label: 'Direction',
            name: 'direction',
            component: 'radio-group',
            direction: 'horizontal',
            variant: 'radio',
            options: [
              {label: 'Horizontal', value: 'horizontal'},
              {label: 'Vertical', value: 'vertical'},
            ],
            defaultValue: 'horizontal',
          },
        ]
      : []),
    ...(type !== 'Multiple Checkbox'
      ? [
          {
            label: 'Required',
            name: 'required',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ]
      : []),
    {
      label: 'Half Width',
      name: 'halfWidth',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    ...(type === 'Multiple Checkbox'
      ? [
          {
            label: 'Hide Label',
            name: 'hideLabel',
            component: 'toggle',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ]
      : []),
  ],
});

const countryField = {
  label: 'Country',
  key: 'country',
  defaultItem: {
    name: 'country',
    label: 'Country',
  },
  itemProps: {
    label: 'Country: {{item.label}}',
  },
  fields: [
    {
      label: 'Name',
      name: 'name',
      component: 'text',
      validate: {
        required: true,
      },
      description:
        'Unique, lowercase, and no spaces\ne.g. "email", "first_name", "accepts_marketing"',
    },
    {
      label: 'Label',
      name: 'label',
      component: 'text',
    },
    {
      label: 'Placeholder',
      name: 'placeholder',
      component: 'text',
    },
    {
      label: 'Info Message',
      name: 'infoMessage',
      component: 'text',
    },
    {
      label: 'Required',
      name: 'required',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Half Width',
      name: 'halfWidth',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
  ],
};

const labelField = {
  label: 'Label',
  key: 'label',
  defaultItem: {
    label: 'Label Text',
  },
  itemProps: {
    label: 'Label: {{item.label}}',
  },
  fields: [
    {
      label: 'Label',
      name: 'label',
      component: 'text',
    },
  ],
};

const checkboxField = {
  label: 'Checkbox',
  key: 'checkbox',
  defaultItem: {
    name: 'checkbox',
    label: 'Checkbox',
  },
  itemProps: {
    label: 'Checkbox: {{item.label}}',
  },
  fields: [
    {
      label: 'Name',
      name: 'name',
      component: 'text',
      validate: {
        required: true,
      },
      description:
        'Unique, lowercase, and no spaces\ne.g. "email", "first_name", "accepts_marketing"',
    },
    {
      label: 'Label',
      name: 'label',
      component: 'text',
    },
    {
      label: 'Link',
      name: 'link',
      component: 'link',
    },
    {
      label: 'Required',
      name: 'required',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Half Width',
      name: 'halfWidth',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
  ],
};

const fileField = {
  label: 'File',
  key: 'file',
  defaultItem: {
    name: 'file',
    label: 'File Upload',
  },
  itemProps: {
    label: 'File: {{item.label}}',
  },
  fields: [
    {
      label: 'Name',
      name: 'name',
      component: 'text',
      validate: {
        required: true,
      },
      description:
        'Unique, lowercase, and no spaces\ne.g. "email", "first_name", "accepts_marketing"',
    },
    {
      label: 'Label',
      name: 'label',
      component: 'text',
    },
    {
      label: 'Info Message',
      name: 'infoMessage',
      component: 'text',
    },
    {
      label: 'Required',
      name: 'required',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Half Width',
      name: 'halfWidth',
      component: 'toggle',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
  ],
};

export const Schema = () => {
  return {
    category: 'Text',
    label: 'Form Builder',
    key: 'form-builder',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/form-preview.jpg?v=1675795223',
    fields: [
      {
        label: 'Form Endpoint',
        name: 'endpoint',
        component: 'text',
        description:
          'Submit button will be disabled until entered.\ne.g. https://getform.io/f/1234-5678-90abcdef',
      },
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'Form Heading',
      },
      {
        label: 'Fields',
        name: 'fields',
        component: 'blocks',
        templates: {
          checkbox: checkboxField,
          country: countryField,
          date: inputField('Date'),
          email: inputField('Email'),
          file: fileField,
          label: labelField,
          multipleCheckbox: multiChoiceField('Multiple Checkbox'),
          number: inputField('Number'),
          phone: inputField('Phone'),
          radio: multiChoiceField('Radio'),
          select: multiChoiceField('Select'),
          text: inputField('Text'),
          textArea: inputField('Text Area'),
          time: inputField('Time'),
          url: inputField('Url'),
        },
      },
      {
        label: 'Submit Button Text',
        name: 'submitText',
        component: 'text',
        defaultValue: 'Submit',
      },
      {
        label: 'reCAPTCHA v2 Enabled',
        name: 'recaptchaEnabled',
        component: 'toggle',
        description:
          'reCAPTCHA v2 site key must first be set as env variable: PUBLIC_RECAPTCHA_SITE_KEY\nNote: widget will only appear on domains whitelisted upon creation of the key. Ensure inclusion of localhost, domain, and any subdomains',
        toggleLabels: {
          true: 'On',
          false: 'Off',
        },
        defaultValue: false,
      },
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Max content width',
        fields: [
          {
            label: 'Max Content Width',
            name: 'maxWidth',
            component: 'select',
            options: [
              {
                label: 'Narrow',
                value: 'max-w-[30rem]',
              },
              {
                label: 'Medium Narrow',
                value: 'max-w-[45rem]',
              },
              {
                label: 'Medium',
                value: 'max-w-[60rem]',
              },
              {
                label: 'Medium Wide',
                value: 'max-w-[75rem]',
              },
              {
                label: 'Wide',
                value: 'max-w-[90rem]',
              },
              {label: 'Full', value: 'max-w-full'},
            ],
          },
        ],
        defaultValue: {
          maxWidth: 'max-w-[60rem]',
        },
      },
      containerSettings(),
    ],
  };
};
