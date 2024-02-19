import {Container} from '~/components';

import {HeroContainer} from './HeroContainer';
import type {HeroCms} from './Hero.types';
import {HeroSlide} from './HeroSlide';
import {HeroSlider} from './HeroSlider';
import {Schema} from './Hero.schema';

export function Hero({cms}: {cms: HeroCms}) {
  const {section, slider, slides} = cms;

  return (
    <Container container={cms.container}>
      <HeroContainer cms={cms}>
        {slides?.length > 1 && (
          <HeroSlider
            aboveTheFold={section?.aboveTheFold}
            slider={slider}
            slides={slides}
          />
        )}

        {slides?.length === 1 && (
          <HeroSlide
            aboveTheFold={section?.aboveTheFold}
            isActiveSlide
            isFirstSlide
            slide={slides[0]}
          />
        )}
      </HeroContainer>
    </Container>
  );
}

Hero.displayName = 'Hero';
Hero.Schema = Schema;
