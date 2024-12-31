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
import {SocialMediaGrid} from './SocialMediaGrid';
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
  /* Text ---------- */
  registerSection(TextBlock, {name: 'text-block'});
  registerSection(Markdown, {name: 'markdown'});
  registerSection(Accordions, {name: 'accordions'});
  registerSection(IconRow, {name: 'icon-row'});

  /* Hero ---------- */
  registerSection(Hero, {name: 'hero'});
  registerSection(HalfHero, {name: 'half-hero'});
  registerSection(Banner, {name: 'banner'});

  /* Featured Media ---------- */
  registerSection(ImageTiles, {name: 'image-tiles'});
  registerSection(ImageTilesGrid, {name: 'image-tiles-grid'});
  registerSection(ImageTilesMosaic, {name: 'image-tiles-mosaic'});
  registerSection(TabbedTilesSlider, {name: 'tabbed-tiles-slider'});
  registerSection(TilesSlider, {name: 'tiles-slider'});
  registerSection(TilesStack, {name: 'tiles-stack'});
  registerSection(SocialMediaGrid, {name: 'social-media-grid'});

  /* Media ---------- */
  registerSection(Image, {name: 'image'});
  registerSection(Video, {name: 'video'});
  registerSection(VideoEmbed, {name: 'video-embed'});

  /* Product ---------- */
  registerSection(ProductsSlider, {name: 'products-slider'});
  registerSection(ProductRecommendationsSlider, {
    name: 'product-recommendations-slider',
  });
  registerSection(BuildYourOwnBundle, {name: 'build-your-own-bundle'});

  /* Reviews ---------- */
  registerSection(PressSlider, {name: 'press-slider'});
  registerSection(TestimonialSlider, {name: 'testimonial-slider'});
  registerSection(ProductReviews, {name: 'product-reviews'});

  /* Form ---------- */
  registerSection(FormBuilder, {name: 'form-builder'});
  registerSection(MarketingSignup, {name: 'marketing-signup'});

  /* HTML ---------- */
  registerSection(Html, {name: 'html'});

  /* Blog ---------- */
  registerSection(BlogCategories, {name: 'blog-categories'});
  registerSection(BlogGrid, {name: 'blog-grid'});

  /* Metaobject example sections ---------- */
  registerSection(MetaobjectTextBlock, {name: 'metaobject-text-block'});
  registerSection(MetaobjectImage, {name: 'metaobject-image'});
}
