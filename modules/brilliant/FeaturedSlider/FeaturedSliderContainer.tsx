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

      {products.length === 0 ? (
        <div className={`grid gap-4 ${mobileGrid} md:${gridCols}`}>
          {[...Array(cms.design === 'expanded' ? 3 : 4)].map((_, i) => (
            <div
              className="flex animate-pulse flex-col overflow-hidden rounded-md border bg-white"
              key={i}
            >
              <div
                className={` ${cms.design === 'expanded' ? 'h-64' : 'h-48'} bg-gray-300`}
              />{' '}
              {/* Image placeholder */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="h-4 w-3/4 rounded bg-gray-300" />
                <div className="mt-2 h-4 w-1/2 rounded bg-gray-300" />
                <div className="mt-auto flex justify-between pt-4">
                  <div className="h-4 w-10 rounded bg-gray-300" />
                  <div className="h-4 w-12 rounded bg-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-4 ${mobileGrid} md:${gridCols}`}>
          {products.map((product) => (
            <FeaturedSliderCard
              key={product.id}
              product={product}
              design={cms.design}
            />
          ))}
        </div>
      )}
    </div>
  );
}
