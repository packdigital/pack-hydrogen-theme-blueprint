import {Container} from '~/components/Container';

import {HeroContainer} from './HeroContainer';
import {HeroSlide} from './HeroSlide';
import {HeroSlider} from './HeroSlider';
import {Schema} from './Hero.schema';
import type {HeroCms} from './Hero.types';

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
