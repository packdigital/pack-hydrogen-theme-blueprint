import type {SeoConfig} from '@shopify/hydrogen';
import type {
  Collection,
  Product,
  ProductVariant,
  Image,
  Shop,
} from '@shopify/hydrogen/storefront-api-types';
import type {
  Article as SeoArticle,
  BreadcrumbList,
  Blog as SeoBlog,
  CollectionPage,
  Offer,
  Organization,
  Product as SeoProduct,
  WebPage,
} from 'schema-dts';

import type {
  ArticlePage,
  BlogPage,
  Page,
  RootSiteSettings,
  Seo,
} from '~/lib/types';

type SeoMedia = SeoConfig['media'];

const getMeta = ({
  page,
  resource,
  shop,
  siteSettings,
}: {
  page?: Page;
  resource?: Record<string, any>;
  shop: Shop;
  siteSettings: RootSiteSettings;
}): {
  title: string;
  description: string;
  pageTitle: string;
  pageDescription: string;
  media: SeoMedia;
  robots: {noIndex: boolean; noFollow: boolean};
} => {
  const {title: seoSiteTitle, description: seoSiteDescription} = {
    ...siteSettings?.data?.siteSettings?.seo,
  } as Seo;
  const siteTitle = seoSiteTitle || shop?.name || '';
  let pageTitle =
    resource?.seo?.title ||
    resource?.title ||
    page?.seo?.title ||
    page?.title ||
    '';
  let title = pageTitle
    ? `${pageTitle}${siteTitle ? ` | ${siteTitle}` : ''}`
    : siteTitle;
  if (page?.handle === '/') {
    pageTitle = pageTitle === 'Homepage' ? siteTitle : pageTitle;
    title = siteTitle;
  }
  const pageDescription =
    resource?.seo?.description ||
    resource?.description ||
    page?.seo?.description ||
    page?.description ||
    '';
  const description = truncate(
    pageDescription || seoSiteDescription || shop?.description || '',
  );
  const media: SeoMedia = {
    type: 'image',
    url: page?.seo?.image || resource?.seo?.image || '',
  };
  const robots = {
    noIndex: !!page?.seo?.noIndex,
    noFollow: !!page?.seo?.noFollow,
  };
  return {title, description, pageTitle, pageDescription, media, robots};
};

function root({
  shop,
  siteSettings,
  url,
}: {
  shop: Shop;
  siteSettings: RootSiteSettings;
  url: Request['url'];
}): SeoConfig<Organization> {
  const {title: seoSiteTitle, description: seoSiteDescription} = {
    ...siteSettings?.data?.siteSettings?.seo,
  } as Seo;
  const title = seoSiteTitle || shop?.name || '';
  const description = truncate(seoSiteDescription || shop?.description || '');
  const siteUrl = new URL(url);
  const origin = siteUrl.origin;

  return {
    title,
    description,
    url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: shop.name,
      logo: shop.brand?.logo?.image?.url,
      sameAs: [], // social media links
      url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/search?q={search_term}`,
        query: "required name='search_term'",
      },
    },
  };
}

function home({
  page,
  shop,
  siteSettings,
}: {
  page?: Page;
  shop: Shop;
  siteSettings: RootSiteSettings;
}): SeoConfig<WebPage> {
  const {title, description, media, robots} = getMeta({
    page,
    shop,
    siteSettings,
  });
  return {
    title,
    description,
    media,
    robots,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Home page',
    },
  };
}

type SelectedVariantRequiredFields = Pick<ProductVariant, 'sku'> & {
  image?: null | Partial<Image>;
};

type ProductRequiredFields = Pick<
  Product,
  'title' | 'description' | 'vendor' | 'seo'
> & {
  featuredImage?: null | Partial<Image>;
  variants: {
    nodes: Array<
      Pick<
        ProductVariant,
        'sku' | 'price' | 'selectedOptions' | 'availableForSale'
      >
    >;
  };
};

function productJsonLd({
  product,
  selectedVariant,
  url,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
}): SeoConfig<SeoProduct | BreadcrumbList>['jsonLd'] {
  const origin = new URL(url).origin;
  const variants = product.variants.nodes;
  const description = truncate(
    product?.seo?.description || product?.description,
  );
  const offers: Offer[] = (variants || []).map((variant) => {
    const variantUrl = new URL(url);
    variant.selectedOptions.forEach((option) => {
      return variantUrl.searchParams.set(option.name, option.value);
    });
    const availability = variant.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

    return {
      '@type': 'Offer',
      availability,
      price: parseFloat(variant.price.amount),
      priceCurrency: variant.price.currencyCode,
      sku: variant?.sku || '',
      url: variantUrl.toString(),
    };
  });
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Homepage',
          item: `${origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: product.title,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: product.vendor,
      },
      description,
      image: [selectedVariant?.image?.url || product?.featuredImage?.url || ''],
      name: product.title,
      offers,
      sku: selectedVariant?.sku || '',
      url,
    },
  ];
}

function product({
  product,
  selectedVariant,
  page,
  shop,
  siteSettings,
  url,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  page: Page;
  shop: Shop;
  siteSettings: RootSiteSettings;
  url: Request['url'];
}): SeoConfig<SeoProduct | BreadcrumbList> {
  const {title, description, media, robots} = getMeta({
    page,
    resource: product,
    shop,
    siteSettings,
  });
  return {
    title,
    description,
    media,
    robots,
    jsonLd: productJsonLd({product, selectedVariant, url}),
  };
}

type CollectionRequiredFields = Omit<
  Collection,
  'products' | 'descriptionHtml' | 'metafields' | 'image' | 'updatedAt'
> & {
  products: {nodes: Pick<Product, 'handle'>[]};
  image?: null | Pick<Image, 'url' | 'height' | 'width' | 'altText'>;
  descriptionHtml?: null | Collection['descriptionHtml'];
  updatedAt?: null | Collection['updatedAt'];
  metafields?: null | Collection['metafields'];
};

function collectionJsonLd({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request['url'];
}): SeoConfig<CollectionPage | BreadcrumbList>['jsonLd'] {
  const origin = new URL(url).origin;
  const itemListElement: CollectionPage['mainEntity'] =
    collection.products.nodes.slice(0, 10).map((product, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/products/${product.handle}`,
      };
    });

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Homepage',
          item: `${origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: collection.title,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: collection?.seo?.title || collection?.title || '',
      description: truncate(
        collection?.seo?.description || collection?.description || '',
      ),
      image: collection?.image?.url,
      url: `/collections/${collection.handle}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement,
      },
    },
  ];
}

function collection({
  collection,
  page,
  shop,
  siteSettings,
  url,
}: {
  collection: CollectionRequiredFields;
  page?: Page;
  shop: Shop;
  siteSettings: RootSiteSettings;
  url: Request['url'];
}): SeoConfig<CollectionPage | BreadcrumbList> {
  const {title, description, media, robots} = getMeta({
    page,
    resource: collection,
    shop,
    siteSettings,
  });
  return {
    title,
    description,
    media,
    robots,
    jsonLd: collectionJsonLd({collection, url}),
  };
}

function article({
  page,
  shop,
  siteSettings,
  url,
}: {
  page: ArticlePage;
  shop: Shop;
  siteSettings: RootSiteSettings;
  url: Request['url'];
}): SeoConfig<SeoArticle> {
  const {title, description, pageTitle, pageDescription, media, robots} =
    getMeta({
      page,
      shop,
      siteSettings,
    });
  return {
    title,
    description,
    media,
    robots,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      datePublished: page?.firstPublishedAt,
      description: pageDescription || truncate(page?.excerpt || ''),
      headline: pageTitle,
      image: page?.seo?.image,
      url,
    },
  };
}

function blog({
  page,
  shop,
  siteSettings,
  url,
}: {
  page: BlogPage;
  shop: Shop;
  siteSettings: RootSiteSettings;
  url: Request['url'];
}): SeoConfig<SeoBlog> {
  const {title, description, pageTitle, pageDescription, media, robots} =
    getMeta({
      page,
      shop,
      siteSettings,
    });
  return {
    title,
    description,
    media,
    robots,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: pageTitle,
      description: pageDescription,
      url,
    },
  };
}

function page({
  page,
  shop,
  siteSettings,
}: {
  page: Page;
  shop: Shop;
  siteSettings: RootSiteSettings;
}): SeoConfig<WebPage> {
  const {title, description, pageTitle, media, robots} = getMeta({
    page,
    shop,
    siteSettings,
  });
  return {
    title,
    description,
    media,
    robots,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
    },
  };
}

export const seoPayload = {
  article,
  blog,
  collection,
  home,
  page,
  product,
  root,
};

/**
 * Truncate a string to a given length, adding an ellipsis if it was truncated
 * @param str - The string to truncate
 * @param num - The maximum length of the string
 * @returns The truncated string
 * @example
 * ```js
 * truncate('Hello world', 5) // 'Hello...'
 * ```
 */
function truncate(str: string, num = 155): string {
  if (typeof str !== 'string') return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - 3) + '...';
}
