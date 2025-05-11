import PopularBundleCard from './ProductBundleCard';

import {Card, CardContent, CardHeader, CardTitle} from '~/components/ui/card';

type MarketingCardSizes = 'small' | 'medium' | 'large';
type MarketingCardTypes = 'popular';

export function JigglePetsBundlerUpsell({
  size,
  cardType,
}: {
  size: MarketingCardSizes;
  cardType: MarketingCardTypes;
}) {
  return (
    <>
      {size === 'medium' && cardType === 'popular' && (
        <div>
          <PopularBundleCard />
        </div>
      )}
    </>
  );
}
