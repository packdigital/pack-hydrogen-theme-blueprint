import kebabCase from 'lodash/kebabCase';

import {Container} from '~/components/Container';

import {HeroContainer} from './HeroContainer';
import {HeroSlide} from './HeroSlide';
import {HeroSlider} from './HeroSlider';
import {Schema} from './Hero.schema';
import type {HeroCms} from './Hero.types';

export function Hero({cms}: {cms: HeroCms}) {
  const {section, slider, slides} = cms;
  // Section name temporarily used as section id until cms supports ids.
  // To avoid styling conflicts between 2+ heros on the same page, ensure section names are unique
  const sectionId = kebabCase(cms.sectionName);

  return (
    <Container container={cms.container}>
      <HeroContainer cms={cms} sectionId={sectionId}>
        {slides?.length > 1 && (
          <HeroSlider
            aboveTheFold={section?.aboveTheFold}
            sectionId={sectionId}
            slider={slider}
            slides={slides}
          />
        )}

        {slides?.length === 1 && (
          <HeroSlide
            aboveTheFold={section?.aboveTheFold}
            index={0}
            isActiveSlide
            isFirstSlide
            sectionId={sectionId}
            slide={slides[0]}
          />
        )}
      </HeroContainer>
    </Container>
  );
}

Hero.displayName = 'Hero';
Hero.Schema = Schema;
