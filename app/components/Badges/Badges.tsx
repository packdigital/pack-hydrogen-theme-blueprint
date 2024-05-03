import {useMemo} from 'react';

import {useSettings} from '~/hooks';

interface BadgesProps {
  className?: string;
  tags: string[];
}

export function Badges({className = '', tags = []}: BadgesProps) {
  const {product} = useSettings();
  const {badgeColors} = {...product?.badges};

  const badgeColorsMap = useMemo((): Record<
    string,
    (typeof badgeColors)[number]
  > => {
    if (!badgeColors) return {};
    return badgeColors.reduce((acc, badge) => {
      return {...acc, [badge.tag?.trim()]: badge};
    }, {});
  }, [badgeColors]);

  const badges = useMemo(() => {
    return tags.reduce((acc: string[], tag) => {
      if (tag.startsWith('badge::')) {
        const value = tag.split('badge::')[1]?.trim();
        if (!value) return acc;
        return [...acc, value];
      }
      return acc;
    }, []);
  }, [tags]);

  return (
    <div
      className={`text-label flex flex-wrap gap-2.5 xs:gap-3 [&_div]:rounded [&_div]:px-2 [&_div]:py-1 ${className}`}
    >
      {badges?.map((badge, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor: badgeColorsMap[badge]?.bgColor || 'var(--black)',
              color: badgeColorsMap[badge]?.textColor || 'var(--white)',
            }}
          >
            {badge}
          </div>
        );
      })}
    </div>
  );
}

Badges.displayName = 'Badges';
