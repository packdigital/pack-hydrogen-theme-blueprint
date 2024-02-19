export function Schema() {
  return {
    category: 'Text',
    label: 'Text Block',
    key: 'metaobject-text-block',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/text-block-preview.jpg?v=1675730349',
    dataSource: {
      source: 'shopify',
      type: 'metaobject',
      reference: {
        type: 'text_block',
      },
    },
    fields: [],
  };
}
