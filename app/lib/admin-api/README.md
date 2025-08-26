# Admin API Client

Shopify's Graphql Admin API can now be utilized with this client within each loader and action `context` — alongside `storefront` and `pack` - under the name of `admin`.

The primary utilization of the Admin API client in Blueprint is to query for `Draft` products while in the customizer, as Storefront API does not return draft products. This allows for previewing or staging draft product pages before the product is made `Active` in Shopify.

Draft products added to a section (e.g. products slider) - via the `productSearch` field in the schema - will also be previewable while in the customzer.

## Development

The Admin API access token from the private app in Shopify for Pack is required as the env `PRIVATE_ADMIN_API_TOKEN`, e.g. "shpat_1a2b3c4d5e6f7g8h9i0jk1l2m3n4o5p6". This is the same private app created when the storefront was first set up in Pack. Note, this API token can only be viewed once. If this token was not saved elsewhere, an additional private app for Pack can be created, while making sure all intended products have this sales channel active; or, Pack can unencrypt the initial private API token in the backend and provide upon request.

The product object from Admin API is not 1 to 1 with a product object from Storefront API. Thus, wherever a product from Admin API is fetched, it is then normalized to have the same shape as Storefront API products. See `normalizeAdminProduct` in `/lib/utils/product.utils.ts`.

Whenever updating the regular Storefront API Graphql queries for Product, remember to:

- Also update the corresponding Admin API queries accordingly (e.g. variants, selling plans, metafields, etc)
- Ensure the changes are kosher by either referencing the [Graphql Admin API Docs](https://shopify.dev/docs/api/admin-graphql), or using the `Shopify GraphiQL App` in Shopify
- If changes to the query are not 1 to 1 with the Storefront API product, update the util `normalizeAdminProduct` to normalize the data returned

## Usage

The Admin API client `admin` is modeled after Hydrogen's `storefront` client and can be used similarly, except there is no support for using the public API token for Admin API.

### Query

`const data = await admin.query(QUERY, {...options});`

Example:

```
async function loader({context}) {
  const {admin} = context;
  const data = await admin.query('query { ... }', {
    variables: {},
    cache: admin.CacheLong(),
  });
}
```

### Mutation

`await admin.mutate(MUTATION, {...options});`

Example:

```
async function action({context}) {
  const {admin} = context;
  await admin.mutate('mutation { ... }', {
    variables: {},
  });
}
```

## Experimental Usage

Having access to Admin API opens doors to the possible usage of Shopify apps that are primarily only compatible with Admin API, such as [Shopify Bundles](https://apps.shopify.com/shopify-bundles) and [Shopify Combined Listings](https://apps.shopify.com/combined-listings). Note, this usage is not default with Blueprint and would require a custom implementation.

## Limitations

There is no implementation in place to add draft product items to collections while in the customizer. Collection products are tied closely with the Storefront API via filters, sorting and order, so properly incorporating Admin API product items would not be ideal.

## Future Updates

Note, files in this `/admin-api` folder are subject to updates with improvements or corrections. Any updates will be notated in future Blueprint releases. Changes can either be added manually by referencing the commit, or this `/admin-api` folder can simply be swapped with the updated folder in the latest Blueprint repo.
