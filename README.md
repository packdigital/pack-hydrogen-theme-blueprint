<p align="center"><a href="https://www.packdigital.com"><img src="https://cdn.shopify.com/s/files/1/0830/5750/8663/files/pack_green_logo.png?v=1708374426" width="40px" alt="Pack Digital - gives growing brands every tool they need to build and manage their Shopify Hydrogen storefront" /></a></p>

<p align="center"><b>Pack's Open-Source Hydrogen Storefront Starter Repo</b></p>

<img width="1840" alt="image" src="https://github.com/packdigital/pack-hydrogen-starter/assets/5673039/df082c77-d0d8-409c-ae81-8101628de7e6">

<p align="center"><b><a href="https://hydrogen.packdigital.com/" target="_blank">Check out the demo store</a></b></p>

## Table of Contents
* [Our Philosophy](#our-philosophy)
* [Major Features](#major-features)
* [Pack Features](#pack-features)
* [Get Started](#get-started)
  * [Environment Variables](#environment-variables)
  * [Requirements](#requirements)
  * [Building for production](#building-for-production)
  * [Building for local development](#building-for-local-development)
* [Pack Customizer Content](#pack-customizer-content)
  * [Caching](#caching)
* [Datalayer](#data-layer)
* [Documentation and Support](#documentation-and-support)
* [Contributors](#contributors)

## Our Philosophy
React is the future of ecommerce, but 99% of all Shopify brands are still using Liquid themes (great for starting out, less optimal for advanced interactivity, flexibility and performance).

Historically, the only way to build a React storefront was to stitch together a headless CMS / hosting / data orchestrator / middleware, then build a custom storefront. It generally required a full technical team to build + manage it.

We’re building open-source starter storefront repos to make it easy for a single developer to get a Hydrogen storefront up and running in minutes, and build out an entire storefront in just a few weeks—without having to worry about the back end. Use these repos as examples / inspo, or build right on top of them.

### Pack’s starter storefront vs Shopify’s out-of-the-box Hydrogen storefront:

We took Hydrogen’s out-of-the-box starter storefront and spent 3 months adding components, features, animations, styling, and connecting it to Pack—a visual frontend for Shopify Hydrogen—to make it easier to spin up a fully-featured storefront.

Connect your Shopify and Github repo to Pack, and you’ll get access to a real-time visual preview of your storefront as you build. Work in 100% code or a mix of visual editing and code.

Instead of hard-coding the whole experience and having to stay on top of every site change, Pack’s platform makes it easy to hand your finished storefront off to non-technical stakeholders so they can make edits on their own. It’s as easy to use as Shopify.


## Major Features
- CSS Framework: Tailwind
- Framework: Remix
- Open-source Hydrogen storefront starter repo that’s opinionated to Pack, a visual frontend for Hydrogen.
  - Responsive components
    - Heros — multiple slides and configurations
    - 50/50 Hero
    - Product tiles
    - Products slider
    - Product recommendations slider
    - Form builder
    - Tiles row
    - Tiles grid
    - Image tiles
    - Text/markdown block
    - Image block
    - Video/video embed block
    - Html block
    - Reviews slider
    - Press slider
    - Testimonials slider
    - Accordions
    - Icon row
    - Social images grid
  - Site settings, menus and modals
    - Promobar
    - Modal
    - Mobile sidebar menu
    - Footer
      - Email newsletter sign up
      - Country selector (change currency, UI/UX for language change)
    - Header
      - Dropdown menus
      - Mobile drawer menu
  - Search, data & analytics
    - Search drawer
    - Search page
    - Leverages Shopify's API
    - SEO and schema markup fields
  - Side cart
    - Free shipping meter
    - Cart upsell products slider
    - Discount code field
  - Shopify analytics (Page views, add to carts)
  - Data layer logic through GA4 (QA’d by Elevar + Fueled)
    - Triggers placed throughout site
      - Page view
      - PDP view
      - Collection view
      - Add to cart
      - Remove from cart
      - View cart
      - Product item click
      - Search results view
      - Login
      - Register
      - Email/phone subscribe
  - Automatic frontend product grouping based on groupings set in Pack admin

Note: Pack is free if you’re only looking to spin up a few landing pages, with pay-as-you-go / custom pricing for large storefronts.

## Pack Features
- Visual editor / headless CMS + content environments
- Native integrations with
  - Shopify product catalog
  - GitHub
  - Hydrogen
  - Metaobjects
- Support for Remix and Oxygen
- A/B testing <b>(coming soon)</b>

## Get started
Create a free Pack account to get started, or check out our documentation.
### Requirements

- Node.js version 16.14.0 or higher

Once you have your project cloned start off by installing your node packages
```
npm install
```

### Environment Variables

To run your application locally, you can use Shopify's mock.shop API to simulate a Shopify storefront. You can set the `PUBLIC_STORE_DOMAIN` environment variable to `mock.shop` to use the mock.shop API.
```dotenv
SESSION_SECRET="foobar"
PUBLIC_STORE_DOMAIN="mock.shop"
PUBLIC_STOREFRONT_API_TOKEN="foobar"
```

You can automate pull in your Shopify environment variables directly from your Shopify Hydrogen storefront using the Hydrogen CLI. Run the command below and follow its prompts.
```
npx shopify hydrogen env pull
```

Alternatively, you can create a `.env` file and manually copy these values from your Shopify Hydrogen storefront. You can find the variables by going to the Hydrogen storefront > Storefront Settings > Environments & Variables. These are the required variables needed:
```dotenv
SESSION_SECRET="XXX"
PUBLIC_STOREFRONT_API_TOKEN="XXX"
PUBLIC_STORE_DOMAIN="XXX"
PACK_PUBLIC_TOKEN="XXX"
PACK_SECRET_TOKEN="XXX"
```


### Building for production

This command will simulate the same deployment job that Shopify Oxygen will use when deploying your live site.

```bash
npm run build
```

### Building for local development

This command will start a server locally on your machine at http://localhost:3000.

```bash
npm run dev
```
## Pack Customizer Content

You can access the data in the Pack Customizer by using the `pack` object that lives in the Hydrogen `context`. See the following example:

```tsx
export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const storeDomain = context.storefront.getShopifyDomain();

  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: any = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {data} = await context.pack.query(PRODUCT_PAGE_QUERY, {
    variables: {handle},
  });

  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
    },
  });

  ...
}
```

The `data` object will contain all the Pack Section Setting content provided by CMS Authors in the Customizer. This data will be define per each Section's Setting schema. While the `product` object will contain any Shopify speficic data provided by the Storefront API.

See https://docs.packdigital.com/for-developers/section-api/schema.

### Caching

Pack is leveraging the same Caching Strategy available with the Hydrogen framework. For an example of this, see `app/lib/pack/create-pack-client.ts`

**NOTE:** In the future, the `lib/pack` library will be moved into it's own NPM package provided by Pack.

```tsx
export function createPackClient(options: CreatePackClientOptions): Pack {
  const {apiUrl, cache, waitUntil, preview, contentEnvironment} = options;
  const previewEnabled = !!preview?.session.get('enabled');
  const previewEnvironment = preview?.session.get('environment');

  return {
    preview,
    isPreviewModeEnabled: () => previewEnabled,
    async query<T = any>(
      query: string,
      {variables, cache: strategy = CacheLong()}: QueryOptions = {},
    ) {
      const queryHash = await hashQuery(query, variables);
      const withCache = createWithCache<QueryResponse<T>>({
        cache,
        waitUntil,
      });

      // The preview environment takes precedence over the content environment
      // provided when creating the client
      const environment =
        previewEnvironment || contentEnvironment || PRODUCTION_ENVIRONMENT;
      const fetchOptions = {
        apiUrl,
        query,
        variables,
        token: options.token,
        previewEnabled,
        contentEnvironment: environment,
      };

      // Preview mode always bypasses the cache
      if (previewEnabled) return packFetch<T>(fetchOptions);

      return withCache(queryHash, strategy, () => packFetch<T>(fetchOptions));
    },
  };
}
```

## Data Layer

The Pack StarterKit will submit `pageView` and `addToCart` (coming soon) to Shopify Analytics via the Hydrogen hook. See the following article for more details:
https://shopify.dev/docs/api/hydrogen/2023-07/utilities/sendshopifyanalytics

For example on how events are submitted view the `products` route (`app/routes/products.$handle.tsx`):

```tsx
export async function loader({params, context, request}: LoaderFunctionArgs) {
  ...

   if (!data.productPage) {
    throw new Response(null, {status: 404});
  }
  // optionally set a default variant, so you always have an "orderable" product selected
  const selectedVariant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };
  const analytics = {
    pageType: AnalyticsPageType.product,
    resourceId: product.id,
    products: [productAnalytics],
    totalValue: parseFloat(selectedVariant.price.amount),
  };

  return defer({
    product,
    productPage: data.productPage,
    selectedVariant,
    storeDomain,
    analytics,
  });
}
```

## Documentation and Support
View [Pack's developer documentation](https://docs.packdigital.com) for info on how to set up and use the platform.
Join our Discord community if you get stuck, want to chat, or are thinking of a new feature.
Or email us at contact@packdigital.com if Discord isn't your thing.
We're here to help - and to make Pack even better!

## Contributors
We ❤ all contributions, big and small!
Read our [quickstart](https://docs.packdigital.com/quickstart) guide for how to set up your local development environment.
The TLDR:
- If there’s a bug, raise an issue
- If you have a fix, fork it and do a PR
- If you have a feature request → Raise it as an issue / discussion, put in a PR if you build it
If you want to, you can reach out via [Discord](#) or email and we'll set up a pair programming session to get you started.

