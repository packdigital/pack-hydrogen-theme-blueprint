import {useEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';

import {ReviewStars} from '~/components';
import {useLocale} from '~/hooks';

export function ProductStars({id}: {id: string}) {
  const fetcher = useFetcher<{
    error: string | null;
    rating: string;
    count: number;
  }>({key: `getProductReviewAggregate:${id}`});
  const {pathPrefix} = useLocale();
  const [reviewAggregate, setReviewAggregate] = useState<{
    rating: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!fetcher.data?.error) return;
    console.error(fetcher.data.error);
  }, [fetcher.data?.error]);

  useEffect(() => {
    if (!id) return;
    // ↓ comment back in once proper third party api call is implemented in `/api/reviews`
    // const {id: productId} = parseGid(id);
    // const searchParams = new URLSearchParams({
    //   productId,
    //   action: 'getProductReviewAggregate',
    // });
    // fetcher.load(`${pathPrefix}/api/reviews?${searchParams}`);
  }, [id]);

  useEffect(() => {
    // ↓ comment back in once proper third party api call is implemented in `/api/reviews`
    // if (!fetcher.data) return;

    // mock data until proper third party api call is implemented
    // returned data will likely look differently
    const {rating = '4.7', count = 105} = {...fetcher?.data};

    setReviewAggregate({rating: Number(rating), count});
  }, [fetcher.data]);

  return (
    <div className="flex min-h-4 flex-wrap items-center gap-1">
      {reviewAggregate && (
        <>
          <ReviewStars rating={reviewAggregate.rating} size="small" />

          <p className="text-2xs text-mediumDarkGray underline underline-offset-[3px]">
            ({reviewAggregate.count} Reviews)
          </p>
        </>
      )}
    </div>
  );
}

ProductStars.displayName = 'ProductStars';
