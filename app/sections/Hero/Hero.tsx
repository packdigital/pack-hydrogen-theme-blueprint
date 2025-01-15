import {Container} from '~/components';

import {HeroContainer} from './HeroContainer';
import type {HeroCms} from './Hero.types';
import {HeroSlide} from './HeroSlide';
import {HeroSlider} from './HeroSlider';
import {Schema} from './Hero.schema';

export function Hero({cms}: {cms: HeroCms}) {
  const {section, slider, slides, id, clientId} = cms;
  const sectionId = id || clientId;

  return (
    <Container container={cms.container}>
      <HeroContainer cms={cms}>
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
