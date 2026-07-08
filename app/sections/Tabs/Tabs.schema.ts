import {containerSettings} from '~/settings/container';

export function Schema() {
  return {
    category: 'Text',
    label: 'Tabs',
    key: 'tabs',
    fields: [
      {
        label: 'Heading',
        name: 'heading',
        component: 'text',
        defaultValue: 'How it works',
      },
      {
        label: 'Tabs',
        name: 'tabs',
        component: 'group-list',
        itemProps: {
          label: '{{item.label}}',
        },
        defaultItem: {
          label: 'New Tab',
          content: [],
        },
        fields: [
          {
            label: 'Label',
            name: 'label',
            component: 'text',
            defaultValue: 'Tab',
          },
          {
            label: 'Content',
            name: 'content',
            component: 'blocks',
            // Pick any registered section schemas that should be embeddable
            // inside a tab. Each tab's body can hold one or more of these.
            sectionTypes: ['text-block', 'icon-row', 'markdown'],
          },
        ],
        defaultValue: [
          {label: 'Step 1', content: []},
          {label: 'Step 2', content: []},
          {label: 'Step 3', content: []},
        ],
      },
      containerSettings(),
    ],
  };
}
