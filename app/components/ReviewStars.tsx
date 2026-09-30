import clsx from 'clsx';

import {Svg} from '~/components/Svg';

interface ReviewStarsProps {
  color?: string;
  rating: number | string | undefined;
  size?: 'small' | 'large';
}

export function ReviewStars({
  color = 'var(--text)',
  rating = 0, // 0 - 5
  size = 'large', // small | large
}: ReviewStarsProps) {
  const fullStar = {
    key: 'star-full',
  };
  const emptyStar = {
    key: 'star-empty',
  };
  const halfStar = {
    key: 'star-half-empty',
  };

  const stars = [...Array(5).keys()].map((index) => {
    const diff = Number(rating) - index;
    if (diff >= 0.75) {
      return fullStar;
    }
    if (diff >= 0.25) {
      return halfStar;
    }
    return emptyStar;
  });

  const classBySize = {
    small: {
      gap: 'gap-0.5',
      width: 'w-3',
    },
    large: {
      gap: 'gap-1',
      width: 'w-4',
    },
  };

  // One text alternative for the whole rating; individual stars are
  // decorative (WCAG 1.1.1)
  return (
    <div
      aria-label={`Rated ${Number(rating) || 0} out of 5 stars`}
      className={clsx('flex items-center', classBySize[size]?.gap)}
      role="img"
    >
      {stars.map(({key}, index) => (
        <Svg
          className={clsx(classBySize[size]?.width)}
          key={index}
          src={`/svgs/${key}.svg#${key}`}
          style={{color}}
          viewBox="0 0 24 24"
        />
      ))}
    </div>
  );
}

ReviewStars.displayName = 'ReviewStars';
