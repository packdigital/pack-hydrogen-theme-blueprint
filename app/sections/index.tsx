import {registerSection} from '@pack/react';
import type {Section} from '@pack/types';

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
import {Marquee} from './Marquee';
import {Product, PRODUCT_SECTION_KEY} from './Product';
import {PressSlider} from './PressSlider';
import {ProductRecommendationsSlider} from './ProductRecommendationsSlider';
import {ProductReviews, PRODUCT_REVIEWS_KEY} from './ProductReviews';
import {ProductsSlider} from './ProductsSlider';
import {RichText} from './RichText';
import {ShoppableProductsGrid} from './ShoppableProductsGrid';
import {
  ShoppableSocialVideo,
  SHOPPABLE_SOCIAL_VIDEO_SECTION_KEY,
} from './ShoppableSocialVideo';
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
  registerSection(TextBlock as Section, {name: 'text-block'});
  registerSection(RichText as Section, {name: 'rich-text'});
  registerSection(Markdown as Section, {name: 'markdown'});
  registerSection(Accordions as Section, {name: 'accordions'});
  registerSection(IconRow as Section, {name: 'icon-row'});
  registerSection(Marquee as Section, {name: 'marquee'});

  /* Hero ---------- */
  registerSection(Hero as Section, {name: 'hero'});
  registerSection(HalfHero as Section, {name: 'half-hero'});
  registerSection(Banner as Section, {name: 'banner'});

  /* Featured Media ---------- */
  registerSection(ImageTiles as Section, {name: 'image-tiles'});
  registerSection(ImageTilesGrid as Section, {name: 'image-tiles-grid'});
  registerSection(ImageTilesMosaic as Section, {name: 'image-tiles-mosaic'});
  registerSection(TabbedTilesSlider as Section, {name: 'tabbed-tiles-slider'});
  registerSection(TilesSlider as Section, {name: 'tiles-slider'});
  registerSection(TilesStack as Section, {name: 'tiles-stack'});
  registerSection(SocialMediaGrid as Section, {name: 'social-media-grid'});

  /* Media ---------- */
  registerSection(Image as Section, {name: 'image'});
  registerSection(Video as Section, {name: 'video'});
  registerSection(VideoEmbed as Section, {name: 'video-embed'});

  /* Product ---------- */
  registerSection(Product as Section, {name: PRODUCT_SECTION_KEY});
  registerSection(ProductsSlider as Section, {name: 'products-slider'});
  registerSection(ProductRecommendationsSlider as Section, {
    name: 'product-recommendations-slider',
  });
  registerSection(ShoppableSocialVideo as Section, {
    name: SHOPPABLE_SOCIAL_VIDEO_SECTION_KEY,
  });
  registerSection(ShoppableProductsGrid as Section, {
    name: 'shoppable-products-grid',
  });
  registerSection(BuildYourOwnBundle as Section, {
    name: 'build-your-own-bundle',
  });

  /* Reviews ---------- */
  registerSection(PressSlider as Section, {name: 'press-slider'});
  registerSection(TestimonialSlider as Section, {name: 'testimonial-slider'});
  registerSection(ProductReviews as Section, {name: PRODUCT_REVIEWS_KEY});

  /* Form ---------- */
  registerSection(FormBuilder as Section, {name: 'form-builder'});
  registerSection(MarketingSignup as Section, {name: 'marketing-signup'});

  /* HTML ---------- */
  registerSection(Html as Section, {name: 'html'});

  /* Blog ---------- */
  registerSection(BlogCategories as Section, {name: 'blog-categories'});
  registerSection(BlogGrid as Section, {name: 'blog-grid'});

  /* Metaobject example sections ---------- */
  registerSection(MetaobjectTextBlock as Section, {
    name: 'metaobject-text-block',
  });
  registerSection(MetaobjectImage as Section, {name: 'metaobject-image'});
}
