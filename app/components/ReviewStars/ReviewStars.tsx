import {useMemo} from 'react';

import {Svg} from '~/components';

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
  const stars = useMemo(() => {
    const fullStar = {
      key: 'star-full',
      label: 'Full Star',
    };
    const emptyStar = {
      key: 'star-empty',
      label: 'Empty Star',
    };
    const halfStar = {
      key: 'star-half-empty',
      label: 'Half Star',
    };

    return [...Array(5).keys()].map((index) => {
      const diff = Number(rating) - index;
      if (diff >= 0.75) {
        return fullStar;
      }
      if (diff >= 0.25) {
        return halfStar;
      }
      return emptyStar;
    });
  }, [rating]);

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

  return (
    <ul className={`flex items-center ${classBySize[size]?.gap}`}>
      {stars.map(({key, label}, index) => (
        <li key={index}>
          <Svg
            className={`${classBySize[size]?.width}`}
            src={`/svgs/${key}.svg#${key}`}
            style={{color}}
            title={label}
            viewBox="0 0 24 24"
          />
        </li>
      ))}
    </ul>
  );
}

ReviewStars.displayName = 'ReviewStars';
