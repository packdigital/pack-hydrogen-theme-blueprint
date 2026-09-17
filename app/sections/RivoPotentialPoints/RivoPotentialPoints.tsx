import {useLoaderData} from 'react-router';
import clsx from 'clsx';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {Container} from '~/components/Container';
import {Image} from '~/components/Image';
import {useRivoLoyalty, useRivoProgramConfig, useRootLoaderData} from '~/hooks';
// Direct import, not the `~/lib/rivo` barrel: that barrel re-exports
// session.server, which must not reach the client bundle. `potentialPoints` is a
// leaf module whose only import is type-only, so it is safe on both sides.
import {calculatePotentialPoints} from '~/lib/rivo/potentialPoints';

import {Schema} from './RivoPotentialPoints.schema';
import type {RivoPotentialPointsCms} from './RivoPotentialPoints.types';

/**
 * "Order and get N points" panel for the product page.
 *
 * The equivalent of Rivo's `potential-points.liquid`. The earning rate is program
 * config that only exists on Rivo's shop metafield, so this renders nothing
 * until `getProgramConfig` resolves and the merchant has enabled the block —
 * an unconfigured store shows no panel rather than "earn 0 points".
 *
 * Signed-in customers in a VIP tier see their own rate when the merchant set up
 * per-tier earning; guests see the default rate, which is the whole point of the
 * block on a product page.
 */
export function RivoPotentialPoints({cms}: {cms: RivoPotentialPointsCms}) {
  const {heading, image, section, subtext} = cms;
  const {product} = useLoaderData<{product: Product}>() || {};
  const {modalProduct} = useRootLoaderData();
  const {config} = useRivoProgramConfig();
  const {customer, isLoggedIn} = useRivoLoyalty();

  const activeProduct = modalProduct || product;

  const points = calculatePotentialPoints({
    config: config?.potentialPoints,
    priceAmount:
      activeProduct?.priceRange?.minVariantPrice?.amount ??
      activeProduct?.variants?.nodes?.[0]?.price?.amount,
    vipTierName: customer?.vipTierName,
  });

  // Rivo lets the merchant target guests only — the panel is an acquisition
  // message, and a member already has the program.
  if (section?.loggedOutOnly && isLoggedIn) return null;
  if (!points) return null;

  const replacePoints = (text?: string) =>
    text?.replace('{{points}}', points.toLocaleString());

  return (
    <Container container={cms.container}>
      <div
        className={clsx(
          'px-contained flex items-center gap-5 rounded-lg py-4',
          !section?.bgColor && 'border border-border',
        )}
        style={{
          backgroundColor: section?.bgColor,
          color: section?.textColor,
        }}
      >
        {image?.url && (
          <Image
            data={{altText: image.altText || '', url: image.url}}
            aspectRatio="1/1"
            className="size-12 shrink-0"
            width="96"
          />
        )}

        <div className="flex flex-col gap-1">
          {heading && <p className="text-label-sm">{replacePoints(heading)}</p>}
          {subtext && (
            <p className="text-caption text-neutralDark">
              {replacePoints(subtext)}
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}

RivoPotentialPoints.displayName = 'RivoPotentialPoints';
RivoPotentialPoints.Schema = Schema;
