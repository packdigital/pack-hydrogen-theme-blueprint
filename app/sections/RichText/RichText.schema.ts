export function Schema() {
  return {
    category: 'Text',
    label: 'Rich Text',
    key: 'rich-text',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/CleanShot_2025-04-02_at_15.55.30_2x_02bc36ac-3561-4b4b-8c14-c1045d38b6ba.png?v=1743634551',
    fields: [
      {
        label: 'Rich Text Field',
        name: 'richtext',
        component: 'rich-text',
        defaultValue: `<h1>Welcome to Your Amazing <span style="color: #3D7AF3">Store</span>!</h1><p>This is where your <strong>brilliant product description</strong> should go. Instead, you're reading placeholder text because someone forgot to update this field (looking at you, dev team).</p><p>Things you could be writing about instead:</p><ul><li>Why your product will change lives</li><li>The incredible features no one else has</li><li>How you stayed up all night perfecting this <strong>very description</strong></li></ul><p>Need inspiration? Check out <a href="https://packdigital.com">Pack</a> or just keep this text and see how long until someone notices!</p>`,
      },
    ],
  };
}
