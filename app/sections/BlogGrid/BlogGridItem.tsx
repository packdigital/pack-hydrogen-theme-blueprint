import {useMemo} from 'react';

import type {Article} from '~/lib/types';
import {Image, Link} from '~/components';

export function BlogGridItem({article}: {article: Article}) {
  const atDate =
    article.firstPublishedAt || article.publishedAt || article.createdAt;
  const date = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(atDate).toLocaleDateString('en-US', options);
  }, [atDate]);

  const url = `/articles/${article.handle}`;

  return (
    <div>
      <Link aria-label={article.title} to={url} tabIndex={-1}>
        <div className="relative mb-4 aspect-[3/2] bg-offWhite">
          {article.seo?.image && (
            <Image
              data={{
                altText: article.title,
                url: article.seo.image,
              }}
              aspectRatio="3/2"
              className="media-fill"
              sizes="(min-width: 768px) 30vw, (min-width: 480px) 45vw, 100vw"
            />
          )}
        </div>
      </Link>

      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-mediumDarkGray">
          {article.author ? `${article.author} | ` : ''}
          {date}
        </p>

        <Link aria-label={article.title} to={url} tabIndex={-1}>
          <h3 className="text-h4">{article.title}</h3>
        </Link>

        {article.excerpt && (
          <p
            className="overflow-hidden text-sm"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {article.excerpt}
          </p>
        )}

        <Link
          aria-label={`Read article ${article.title}`}
          className="text-label text-main-underline"
          to={url}
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

BlogGridItem.displayName = 'BlogGridItem';
