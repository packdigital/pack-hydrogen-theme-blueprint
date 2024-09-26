import {redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {ARTICLE_QUERY} from '~/data/queries';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {locale, handle} = params;
  const {data} = await context.pack.query(ARTICLE_QUERY, {
    variables: {handle},
    cache: context.storefront.CacheLong(),
  });

  if (!data?.article?.blog) throw new Response(null, {status: 404});

  const blogHandle = data.article.blog.handle;
  const blogPath = `/blogs/${blogHandle}/${handle}`;
  const newPath = locale ? `/${locale}${blogPath}` : blogPath;

  // Redirect to the new path
  return redirect(newPath, 301);
}
