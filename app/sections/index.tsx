import {registerSection} from '@pack/react';

import {Accordions} from './Accordions';
import {Banner} from './Banner';
import {BlogCategories} from './BlogCategories';
import {BlogGrid} from './BlogGrid';
import {FormBuilder} from './FormBuilder';
import {HalfHero} from './HalfHero';
import {Hero} from './Hero';
import {Html} from './Html';
import {IconRow} from './IconRow';
import {Image} from './Image';
import {ImageTiles} from './ImageTiles';
import {ImageTilesGrid} from './ImageTilesGrid';
import {Markdown} from './Markdown';
import {PressSlider} from './PressSlider';
import {ProductRecommendationsSlider} from './ProductRecommendationsSlider';
import {ProductsSlider} from './ProductsSlider';
import {SocialImagesGrid} from './SocialImagesGrid';
import {TabbedThreeTiles} from './TabbedThreeTiles';
import {TestimonialSlider} from './TestimonialSlider';
import {TextBlock} from './TextBlock';
import {ThreeTiles} from './ThreeTiles';
import {TwoTiles} from './TwoTiles';
import {Video} from './Video';
import {VideoEmbed} from './VideoEmbed';
import {MetaobjectTextBlock} from './MetaobjectTextBlock/MetaobjectTextBlock';
import {MetaobjectImage} from './MetaobjectImage';

export function registerSections() {
  registerSection(Accordions, {name: 'accordions'});
  registerSection(Banner, {name: 'banner'});
  registerSection(BlogCategories, {name: 'blog-categories'});
  registerSection(BlogGrid, {name: 'blog-grid'});
  registerSection(FormBuilder, {name: 'form-builder'});
  registerSection(HalfHero, {name: 'half-hero'});
  registerSection(Hero, {name: 'hero'});
  registerSection(Html, {name: 'html'});
  registerSection(IconRow, {name: 'icon-row'});
  registerSection(Image, {name: 'image'});
  registerSection(ImageTiles, {name: 'image-tiles'});
  registerSection(ImageTilesGrid, {name: 'image-tiles-grid'});
  registerSection(Markdown, {name: 'markdown'});
  registerSection(PressSlider, {name: 'press-slider'});
  registerSection(ProductRecommendationsSlider, {
    name: 'product-recommendations-slider',
  });
  registerSection(ProductsSlider, {name: 'products-slider'});
  registerSection(SocialImagesGrid, {name: 'social-images-grid'});
  registerSection(TabbedThreeTiles, {name: 'tabbed-three-tiles'});
  registerSection(TestimonialSlider, {name: 'testimonial-slider'});
  registerSection(TextBlock, {name: 'text-block'});
  registerSection(ThreeTiles, {name: 'three-tiles'});
  registerSection(TwoTiles, {name: 'two-tiles'});
  registerSection(Video, {name: 'video'});
  registerSection(VideoEmbed, {name: 'video-embed'});
  registerSection(MetaobjectTextBlock, {name: 'metaobject-text-block'});
  registerSection(MetaobjectImage, {name: 'metaobject-image'});
}
