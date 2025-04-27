import {Product} from '@shopify/hydrogen/storefront-api-types';
import {ChevronRightIcon} from 'lucide-react';
import {useMemo} from 'react';

import type {FeaturedSliderCms} from './FeaturedSlider.types';
import {FeaturedSliderCard} from './FeaturedSliderCard';

import {Link} from '~/components/Link';
export function FeaturedSliderContainer({
  products,
  cms,
}: {
  products: Product[];
  cms: FeaturedSliderCms;
}) {
  const numberOfProducts = useMemo(() => products.length, [products.length]);
  const gridCols = useMemo(
    () => (numberOfProducts <= 3 ? 'grid-cols-3' : 'grid-cols-4'),
    [numberOfProducts],
  );
  const mobileGrid = useMemo(
    () => (cms.design === 'expanded' ? 'grid-cols-1' : 'grid-cols-2'),
    [cms.design],
  );

  const link = useMemo(() => cms.link, [cms.link]);

  return (
    <div className="">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex">
          <h3 className="text-2xl">{cms.heading}</h3>
        </div>
        <div className="flex items-center text-sm">
          <Link
            aria-label={cms.link?.text}
            className=""
            to={link?.url}
            newTab={cms.link?.newTab}
            type={cms.link?.type}
          >
            <div className="flex flex-row items-center justify-center">
              <div className="">View All</div>
              <div className="">
                <ChevronRightIcon size={18} />
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className={`grid gap-4 ${mobileGrid} md:${gridCols}`}>
        {products.map((product) => (
          <FeaturedSliderCard
            key={product.id}
            product={product}
            design={cms.design}
          />
        ))}
      </div>
    </div>
  );
}
