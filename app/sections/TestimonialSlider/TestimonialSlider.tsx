import clsx from 'clsx';

import {Carousel} from '~/components/Carousel';
import {Container} from '~/components/Container';
import {Link} from '~/components/Link';
import {ReviewStars} from '~/components/ReviewStars';

import {Schema} from './TestimonialSlider.schema';
import type {TestimonialSliderCms} from './TestimonialSlider.types';

export function TestimonialSlider({cms}: {cms: TestimonialSliderCms}) {
  const {heading, link, section, testimonialSlides: blocks} = {...cms};
  const {fullWidth, reviewStarColor, sliderPaginationBulletColor, textColor} = {
    ...section,
  };
  const maxWidthClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div className="md:px-contained py-12 lg:py-16">
        <div
          className={clsx(
            'relative mx-auto flex flex-col items-center lg:px-14',
            maxWidthClass,
          )}
        >
          <h2 className="text-h2 px-4 text-center" style={{color: textColor}}>
            {heading}
          </h2>

          {blocks?.length > 0 && (
            <Carousel
              activeDotColor={sliderPaginationBulletColor}
              ariaLabel={heading || 'Testimonials'}
              arrows={blocks.length > 3}
              className="mt-10 w-full"
              dots
              gap={{base: 16, md: 0}}
              options={{loop: blocks.length >= 2}}
              slidesPerView={{base: 1, md: 2, lg: 3}}
              slides={blocks.map((item, index) => {
                const rating = item.rating ? parseFloat(item.rating) : 5;
                return (
                  <div
                    className="mx-auto flex max-w-[18.75rem] flex-col items-center text-center lg:max-w-[15.625rem]"
                    key={index}
                    style={{
                      color: textColor,
                    }}
                  >
                    <ReviewStars rating={rating} color={reviewStarColor} />

                    <h3 className="my-4 text-2xl">{item.title}</h3>

                    {item.body && <p>{item.body}</p>}

                    {item.author && (
                      <p className="mt-4 text-base font-normal">
                        {item.author}
                      </p>
                    )}
                  </div>
                );
              })}
            />
          )}

          {link?.text && (
            <div className="mt-10">
              <Link
                aria-label={link.text}
                className="btn-primary"
                to={link.url}
                newTab={link.newTab}
                type={link.type}
              >
                {link.text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

TestimonialSlider.displayName = 'TestimonialSlider';
TestimonialSlider.Schema = Schema;
