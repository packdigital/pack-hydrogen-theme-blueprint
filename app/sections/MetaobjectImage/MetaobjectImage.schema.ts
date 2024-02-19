export function Schema() {
  return {
    category: 'Media',
    label: 'Image',
    key: 'metaobject-image',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/image-preview.jpg?v=1675730321',
    dataSource: {
      source: 'shopify',
      type: 'metaobject',
      reference: {
        type: 'image',
      },
    },
    fields: [],
  };
}
