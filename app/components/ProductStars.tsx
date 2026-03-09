import {memo, useEffect, useState} from 'react';
import {parseGid} from '@shopify/hydrogen';

import {ReviewStars} from '~/components/ReviewStars';
import {useLoadData, useLocale} from '~/hooks';

export const ProductStars = memo(({id}: {id: string}) => {
  const {pathPrefix} = useLocale();
  const [reviewAggregate, setReviewAggregate] = useState<{
    rating: number;
    count: number;
  } | null>(null);

  const {data} = useLoadData<{
    error: string | null;
    rating: string;
    count: number;
  }>(
    // ↓ comment back in once proper third party api call is implemented in `/api/reviews`
    // id
    //   ? `${pathPrefix}/api/reviews?productId=${parseGid(id).id}&action=getProductReviewAggregate`
    //   :
    //
    null,
  );

  useEffect(() => {
    // ↓ comment back in once proper third party api call is implemented in `/api/reviews`
    // if (!data) return;

    // mock data until proper third party api call is implemented
    // returned data will likely look differently
    const {rating = '4.7', count = 105} = {...data};

    setReviewAggregate({rating: Number(rating), count});
  }, [data]);

  return (
    <div className="flex min-h-4 flex-wrap items-center gap-1">
      {reviewAggregate && (
        <>
          <ReviewStars rating={reviewAggregate.rating} size="small" />

          <p className="text-2xs text-neutralMedium underline underline-offset-[3px]">
            ({reviewAggregate.count} Reviews)
          </p>
        </>
      )}
    </div>
  );
});

ProductStars.displayName = 'ProductStars';
