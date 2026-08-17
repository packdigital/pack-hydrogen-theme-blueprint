import clsx from 'clsx';

import {Container} from '~/components/Container';
import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {RivoSkeleton} from '~/components/Rivo';
import {useRivoLoyalty} from '~/hooks';

import {Schema} from './RivoLoyaltyHero.schema';
import type {RivoLoyaltyHeroCms} from './RivoLoyaltyHero.types';

/**
 * Loyalty program hero. Sells the program to guests and greets members with
 * their live balance and tier.
 */
export function RivoLoyaltyHero({cms}: {cms: RivoLoyaltyHeroCms}) {
  const {buttons, eyebrow, heading, image, member, section, subtext} = cms;
  const {customer, isLoading, isLoggedIn, pointsTally} = useRivoLoyalty();

  const Heading = section?.aboveTheFold === false ? 'h2' : 'h1';
  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  const greeting = customer?.firstName
    ? (member?.greeting || 'Welcome back, {{name}}').replace(
        '{{name}}',
        customer.firstName,
      )
    : member?.greetingFallback || 'Welcome back';

  return (
    <Container container={cms.container}>
      <div
        className="px-contained py-contained"
        style={{
          backgroundColor: section?.bgColor,
          color: section?.textColor,
        }}
      >
        <div
          className={clsx(
            'mx-auto flex flex-col items-center gap-6 text-center',
            maxWidthClass,
          )}
        >
          {image?.url && (
            <Image
              data={{altText: image.altText || heading, url: image.url}}
              className="max-h-24 w-auto"
              width="240"
            />
          )}

          {eyebrow && (
            <p className="text-caption uppercase tracking-wide">{eyebrow}</p>
          )}

          {heading && (
            <Heading className="text-h1 mx-auto max-w-[46rem]">
              {heading}
            </Heading>
          )}

          {subtext && (
            <p className="text-body mx-auto max-w-[46rem]">{subtext}</p>
          )}

          {/* Members see live balance in place of the join CTA. */}
          {isLoggedIn ? (
            isLoading ? (
              <RivoSkeleton className="w-full max-w-sm" count={1} />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <p className="text-h5">{greeting}</p>

                {typeof pointsTally === 'number' && (
                  <p className="text-body">
                    {`${pointsTally.toLocaleString()} ${
                      member?.pointsSuffix || 'points available'
                    }`}
                  </p>
                )}

                {customer?.vipTierName && (
                  <p className="text-caption uppercase">
                    {`${member?.tierPrefix || 'Your tier'}: ${customer.vipTierName}`}
                  </p>
                )}

                {member?.link?.url && (
                  <Link
                    aria-label={member.link.text}
                    className={clsx(member.linkStyle || 'btn-primary', 'mt-2')}
                    to={member.link.url}
                  >
                    {member.link.text}
                  </Link>
                )}
              </div>
            )
          ) : (
            !!buttons?.length && (
              <ul className="flex flex-col justify-center gap-4 xs:flex-row">
                {buttons.slice(0, 2).map(({link, style}, index) => (
                  <li key={index}>
                    <Link
                      aria-label={link?.text}
                      className={clsx(style)}
                      newTab={link?.newTab}
                      // Nothing to prefetch on the OAuth login redirect.
                      prefetch={
                        link?.url?.includes('/account/login')
                          ? 'none'
                          : undefined
                      }
                      to={link?.url}
                      type={link?.type}
                    >
                      {link?.text}
                    </Link>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </Container>
  );
}

RivoLoyaltyHero.displayName = 'RivoLoyaltyHero';
RivoLoyaltyHero.Schema = Schema;
