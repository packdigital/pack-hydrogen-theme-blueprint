import {registerSection} from '@pack/react';

import {Accordions} from './Accordions';
import {Banner} from './Banner';
import {BlogCategories} from './BlogCategories';
import {BlogGrid} from './BlogGrid';
import {BuildYourOwnBundle} from './BuildYourOwnBundle';
import {FormBuilder} from './FormBuilder';
import {HalfHero} from './HalfHero';
import {Hero} from './Hero';
import {Html} from './Html';
import {IconRow} from './IconRow';
import {Image} from './Image';
import {ImageTiles} from './ImageTiles';
import {ImageTilesGrid} from './ImageTilesGrid';
import {ImageTilesMosaic} from './ImageTilesMosaic';
import {Markdown} from './Markdown';
import {MarketingSignup} from './MarketingSignup';
import {PressSlider} from './PressSlider';
import {ProductRecommendationsSlider} from './ProductRecommendationsSlider';
import {ProductReviews} from './ProductReviews';
import {ProductsSlider} from './ProductsSlider';
import {SocialImagesGrid} from './SocialImagesGrid';
import {TabbedTilesSlider} from './TabbedTilesSlider';
import {TestimonialSlider} from './TestimonialSlider';
import {TextBlock} from './TextBlock';
import {TilesSlider} from './TilesSlider';
import {TilesStack} from './TilesStack';
import {Video} from './Video';
import {VideoEmbed} from './VideoEmbed';
import {MetaobjectTextBlock} from './MetaobjectTextBlock/MetaobjectTextBlock';
import {MetaobjectImage} from './MetaobjectImage';

export function registerSections() {
  registerSection(Accordions, {name: 'accordions'});
  registerSection(Banner, {name: 'banner'});
  registerSection(BlogCategories, {name: 'blog-categories'});
  registerSection(BlogGrid, {name: 'blog-grid'});
  registerSection(BuildYourOwnBundle, {name: 'build-your-own-bundle'});
  registerSection(FormBuilder, {name: 'form-builder'});
  registerSection(HalfHero, {name: 'half-hero'});
  registerSection(Hero, {name: 'hero'});
  registerSection(Html, {name: 'html'});
  registerSection(IconRow, {name: 'icon-row'});
  registerSection(Image, {name: 'image'});
  registerSection(ImageTiles, {name: 'image-tiles'});
  registerSection(ImageTilesGrid, {name: 'image-tiles-grid'});
  registerSection(ImageTilesMosaic, {name: 'image-tiles-mosaic'});
  registerSection(Markdown, {name: 'markdown'});
  registerSection(MarketingSignup, {name: 'marketing-signup'});
  registerSection(PressSlider, {name: 'press-slider'});
  registerSection(ProductRecommendationsSlider, {
    name: 'product-recommendations-slider',
  });
  registerSection(ProductReviews, {name: 'product-reviews'});
  registerSection(ProductsSlider, {name: 'products-slider'});
  registerSection(SocialImagesGrid, {name: 'social-images-grid'});
  registerSection(TabbedTilesSlider, {name: 'tabbed-tiles-slider'});
  registerSection(TestimonialSlider, {name: 'testimonial-slider'});
  registerSection(TextBlock, {name: 'text-block'});
  registerSection(TilesSlider, {name: 'tiles-slider'});
  registerSection(TilesStack, {name: 'tiles-stack'});
  registerSection(Video, {name: 'video'});
  registerSection(VideoEmbed, {name: 'video-embed'});
  registerSection(MetaobjectTextBlock, {name: 'metaobject-text-block'});
  registerSection(MetaobjectImage, {name: 'metaobject-image'});
}
