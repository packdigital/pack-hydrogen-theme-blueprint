export function Schema() {
  return {
    category: 'Text',
    label: 'Rich Text',
    key: 'rich-text',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/CleanShot_2025-04-02_at_15.41.14_2x_fb5c3681-5504-4c2f-96a7-2766dc5980ea.png?v=1743633705',
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
