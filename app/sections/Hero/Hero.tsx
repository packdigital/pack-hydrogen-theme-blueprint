import {Container} from '~/components/Container';

import {HeroContainer} from './HeroContainer';
import {HeroSlide} from './HeroSlide';
import {HeroSlider} from './HeroSlider';
import {Schema} from './Hero.schema';
import type {HeroCms} from './Hero.types';

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
